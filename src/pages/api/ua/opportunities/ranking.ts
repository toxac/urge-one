// app/api/ai/opportunity-ranking/route.ts
import { opportunityRankingService } from '@/lib/ai/services/opportunity-ranking-service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { opportunities, userContext } = await request.json();

    if (!opportunities || !Array.isArray(opportunities) || opportunities.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 opportunities are required for ranking' },
        { status: 400 }
      );
    }

    if (!userContext || !userContext.skills || !userContext.goals) {
      return NextResponse.json(
        { error: 'User context with skills and goals is required' },
        { status: 400 }
      );
    }

    const ranking = await opportunityRankingService.rankOpportunities(
      opportunities,
      userContext
    );

    return NextResponse.json({ ranking });
  } catch (error) {
    console.error('Opportunity ranking API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to rank opportunities';
    const status = errorMessage.includes('Too many opportunities') ? 400 : 500;
    
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
}