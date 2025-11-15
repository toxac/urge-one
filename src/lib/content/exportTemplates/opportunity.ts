// lib/export/opportunity-markdown.ts
import { getDiscoveryMethod, getCategory, getObservationType } from '@/lib/options/opportunity-options';

export interface MarkdownExportOptions {
  includeAssessments?: boolean;
  includeMarketResearch?: boolean;
  includePersonalContext?: boolean;
  format?: 'full' | 'minimal' | 'research-focus';
}

export function generateOpportunityMarkdown(
  opportunity: any,
  userContext?: any,
  options: MarkdownExportOptions = {}
): string {
  const {
    includeAssessments = true,
    includeMarketResearch = true,
    includePersonalContext = true,
    format = 'full'
  } = options;

  const sections: string[] = [];

  // Header
  sections.push(`# Opportunity: ${opportunity.title || 'Untitled'}`);
  sections.push(`*Generated from Urge Platform on ${new Date().toLocaleDateString()}*`);
  sections.push('');

  // Core Opportunity Details
  sections.push('## 📋 Core Opportunity Details');
  sections.push(`**Description:** ${opportunity.description || 'No description'}`);
  sections.push(`**Primary Pain Point:** ${opportunity.top_pain_point || 'Not specified'}`);
  sections.push(`**Category:** ${getCategory(opportunity.category)}`);
  sections.push(`**Discovery Method:** ${getDiscoveryMethod(opportunity.discovery_method)}`);
  
  if (opportunity.observation_type) {
    sections.push(`**Observation Type:** ${getObservationType(opportunity.discovery_method, opportunity.observation_type)}`);
  }
  
  sections.push(`**Status:** ${opportunity.status || 'Under evaluation'}`);
  sections.push('');

  // Personal Context (if available and requested)
  if (includePersonalContext && userContext) {
    sections.push('## 👤 Personal Context');
    sections.push('*This context helps assess alignment with your specific situation*');
    sections.push('');
    
    if (userContext.skills?.length) {
      sections.push(`**Relevant Skills:** ${userContext.skills.join(', ')}`);
    }
    
    if (userContext.goals?.length) {
      sections.push(`**Personal Goals:** ${userContext.goals.join(', ')}`);
    }
    
    if (userContext.riskTolerance) {
      sections.push(`**Risk Tolerance:** ${userContext.riskTolerance}`);
    }
    
    if (userContext.availableResources?.length) {
      sections.push(`**Available Resources:** ${userContext.availableResources.join(', ')}`);
    }
    sections.push('');
  }

  // Urge Platform Assessment (if available)
  if (includeAssessments && opportunity.assessment_rationale) {
    sections.push('## 🎯 Urge Platform Assessment');
    sections.push('*Based on Urge\'s philosophy of Action Over Theory and MSP (Minimal Sellable Product)*');
    sections.push('');
    
    if (opportunity.alignment_assessment_score) {
      sections.push(`**Alignment Score:** ${opportunity.alignment_assessment_score}/5`);
    }
    
    if (opportunity.skill_assessment_score) {
      sections.push(`**Skills Match:** ${opportunity.skill_assessment_score}/5`);
    }
    
    if (opportunity.capital_assessment_score) {
      sections.push(`**Capital Feasibility:** ${opportunity.capital_assessment_score}/5`);
    }
    
    if (opportunity.risk_comfort_score) {
      sections.push(`**Risk Comfort:** ${opportunity.risk_comfort_score}/5`);
    }
    
    sections.push('');
    sections.push('### Assessment Rationale');
    sections.push(opportunity.assessment_rationale);
    sections.push('');
  }

  // Market Research Data (if available)
  if (includeMarketResearch && opportunity.market_trend) {
    sections.push('## 📊 Market Research');
    sections.push('*Research data to help validate this opportunity*');
    sections.push('');
    
    sections.push('### Market Overview');
    sections.push(`**Market Trend:** ${opportunity.market_trend}`);
    
    if (opportunity.market_size) {
      const marketSize = typeof opportunity.market_size === 'string' 
        ? opportunity.market_size 
        : JSON.stringify(opportunity.market_size, null, 2);
      sections.push(`**Market Size:** ${marketSize}`);
    }
    
    if (opportunity.market_size_rationale) {
      sections.push(`**Market Size Rationale:** ${opportunity.market_size_rationale}`);
    }
    sections.push('');

    // Competitors
    if (opportunity.competitors?.length) {
      sections.push('### 🏢 Competitors');
      opportunity.competitors.forEach((competitor: string, index: number) => {
        sections.push(`${index + 1}. ${competitor}`);
      });
      sections.push('');
    }

    // Barriers to Entry
    if (opportunity.barriers_to_entry?.length) {
      sections.push('### 🚧 Barriers to Entry');
      opportunity.barriers_to_entry.forEach((barrier: string, index: number) => {
        sections.push(`${index + 1}. ${barrier}`);
      });
      sections.push('');
    }

    // Target Audience Analysis
    if (opportunity.target_demographics || opportunity.target_psychographics) {
      sections.push('### 🎯 Target Audience');
      
      if (opportunity.target_demographics) {
        const demographics = typeof opportunity.target_demographics === 'string'
          ? opportunity.target_demographics
          : JSON.stringify(opportunity.target_demographics, null, 2);
        sections.push(`**Demographics:** ${demographics}`);
      }
      
      if (opportunity.target_psychographics) {
        const psychographics = typeof opportunity.target_psychographics === 'string'
          ? opportunity.psychographics
          : JSON.stringify(opportunity.target_psychographics, null, 2);
        sections.push(`**Psychographics:** ${psychographics}`);
      }
      sections.push('');
    }

    // Customer Insights
    if (opportunity.target_unmet_needs?.length) {
      sections.push('### ❓ Unmet Customer Needs');
      opportunity.target_unmet_needs.forEach((need: string, index: number) => {
        sections.push(`${index + 1}. ${need}`);
      });
      sections.push('');
    }

    if (opportunity.target_motivations?.length) {
      sections.push('### 💡 Customer Motivations');
      opportunity.target_motivations.forEach((motivation: string, index: number) => {
        sections.push(`${index + 1}. ${motivation}`);
      });
      sections.push('');
    }

    // Buying Behavior
    if (opportunity.target_buying_behaviour) {
      sections.push('### 🛒 Buying Behavior');
      const behavior = typeof opportunity.target_buying_behaviour === 'string'
        ? opportunity.target_buying_behaviour
        : JSON.stringify(opportunity.target_buying_behaviour, null, 2);
      sections.push(behavior);
      sections.push('');
    }
  }

  // Next Steps & Research Questions
  sections.push('## 🔍 Recommended Research Questions');
  sections.push('*Use these questions with your preferred AI tool to dive deeper:*');
  sections.push('');
  sections.push('### Market Validation Questions');
  sections.push('1. What are the latest trends in this specific market?');
  sections.push('2. Who are the emerging competitors I might have missed?');
  sections.push('3. What regulatory changes could impact this opportunity?');
  sections.push('4. How are customer preferences evolving in this space?');
  sections.push('');
  
  sections.push('### Business Model Questions');
  sections.push('1. What would be the simplest version (MSP) I could sell?');
  sections.push('2. What pricing strategies work best in this market?');
  sections.push('3. How can I validate demand before building anything?');
  sections.push('4. What distribution channels are most effective?');
  sections.push('');
  
  sections.push('### Personal Fit Questions');
  sections.push('1. What skills would I need to develop for this opportunity?');
  sections.push('2. How does this align with my long-term goals?');
  sections.push('3. What support would I need from my Cheer Squad?');
  sections.push('4. What\'s the fastest path to first revenue?');
  sections.push('');

  // Urge Philosophy Reminder
  sections.push('## 💡 Remember Urge Principles');
  sections.push('- **Action Over Theory**: Focus on doing, not just planning');
  sections.push('- **MSP Mindset**: Build the Minimal Sellable Product first');
  sections.push('- **Real Sales**: Validation comes from customers paying');
  sections.push('- **Personal Success**: Define success by your goals, not others\'');
  sections.push('');

  return sections.join('\n');
}

// Batch export for multiple opportunities
export function generateOpportunitiesPortfolioMarkdown(
  opportunities: any[],
  userContext?: any,
  options: MarkdownExportOptions = {}
): string {
  const sections: string[] = [];
  
  sections.push('# Urge Platform - Opportunities Portfolio');
  sections.push(`*Generated on ${new Date().toLocaleDateString()}*`);
  sections.push(`*Total Opportunities: ${opportunities.length}*`);
  sections.push('');
  
  // Summary table
  sections.push('## 📊 Portfolio Summary');
  sections.push('| Opportunity | Category | Status | Alignment Score |');
  sections.push('|-------------|----------|--------|----------------|');
  
  opportunities.forEach(opp => {
    const title = opp.title || 'Untitled';
    const category = getCategory(opp.category) || 'Uncategorized';
    const status = opp.status || 'Evaluation';
    const score = opp.alignment_assessment_score || 'N/A';
    
    sections.push(`| ${title} | ${category} | ${status} | ${score} |`);
  });
  
  sections.push('');
  
  // Individual opportunities
  opportunities.forEach((opp, index) => {
    sections.push(`---`);
    sections.push('');
    sections.push(generateOpportunityMarkdown(opp, userContext, options));
    sections.push('');
  });
  
  // Portfolio-level insights
  sections.push('## 🎯 Portfolio Insights');
  sections.push('*Questions to explore with your AI assistant:*');
  sections.push('');
  sections.push('1. **Portfolio Balance**: Do these opportunities provide risk diversification?');
  sections.push('2. **Resource Allocation**: How should I prioritize my time and resources?');
  sections.push('3. **Synergy Potential**: Could any opportunities work well together?');
  sections.push('4. **Timeline Strategy**: What sequencing makes the most sense?');
  sections.push('5. **Skill Development**: What capabilities should I build across these opportunities?');
  
  return sections.join('\n');
}