// app/api/export/opportunity/[id]/markdown/route.ts
import { generateOpportunityMarkdown } from '@/lib/export/opportunity-markdown';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAssessments = searchParams.get('assessments') !== 'false';
    const includeResearch = searchParams.get('research') !== 'false';
    const format = searchParams.get('format') || 'full';

    const supabase = createClient();
    
    // Get opportunity data
    const { data: opportunity, error } = await supabase
      .from('user_opportunities')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !opportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    // Get user context if available
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('skills, goals, risk_tolerance, available_resources')
      .eq('id', opportunity.user_id)
      .single();

    const markdown = generateOpportunityMarkdown(
      opportunity,
      userProfile || {},
      {
        includeAssessments,
        includeMarketResearch: includeResearch,
        format: format as any
      }
    );

    // Return as downloadable file
    return new NextResponse(markdown, {
      headers: {
        'Content-Type': 'text/markdown',
        'Content-Disposition': `attachment; filename="urge-opportunity-${opportunity.title?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'untitled'}.md"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export opportunity' },
      { status: 500 }
    );
  }
}

// Batch export endpoint
// app/api/export/opportunities/markdown/route.ts
import { generateOpportunitiesPortfolioMarkdown } from '@/lib/export/opportunity-markdown';

export async function POST(request: NextRequest) {
  try {
    const { opportunityIds, options } = await request.json();
    
    const supabase = createClient();
    
    const { data: opportunities, error } = await supabase
      .from('user_opportunities')
      .select('*')
      .in('id', opportunityIds);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch opportunities' },
        { status: 500 }
      );
    }

    // Get user context from first opportunity
    const userId = opportunities[0]?.user_id;
    let userContext = {};
    
    if (userId) {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('skills, goals, risk_tolerance, available_resources')
        .eq('id', userId)
        .single();
      
      userContext = userProfile || {};
    }

    const markdown = generateOpportunitiesPortfolioMarkdown(
      opportunities,
      userContext,
      options
    );

    return new NextResponse(markdown, {
      headers: {
        'Content-Type': 'text/markdown',
        'Content-Disposition': 'attachment; filename="urge-opportunities-portfolio.md"',
      },
    });
  } catch (error) {
    console.error('Batch export error:', error);
    return NextResponse.json(
      { error: 'Failed to export opportunities' },
      { status: 500 }
    );
  }
}