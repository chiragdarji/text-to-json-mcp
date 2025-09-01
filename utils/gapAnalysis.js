/**
 * Utility functions for analyzing text prompts and identifying clarity gaps
 */

// Keywords that often indicate missing context
const CONTEXT_INDICATORS = [
  'it', 'this', 'that', 'they', 'them', 'those', 'here', 'there',
  'the system', 'the app', 'the website', 'the platform'
];

// Keywords that suggest ambiguous requirements
const AMBIGUITY_INDICATORS = [
  'maybe', 'possibly', 'might', 'could', 'should', 'would',
  'better', 'best', 'good', 'nice', 'pretty', 'cool',
  'soon', 'quickly', 'fast', 'efficient', 'user-friendly'
];

// Keywords that indicate unclear outputs
const OUTPUT_INDICATORS = [
  'something', 'stuff', 'things', 'data', 'information',
  'report', 'summary', 'analysis', 'results'
];

// Keywords that suggest missing constraints
const CONSTRAINT_INDICATORS = [
  'any', 'all', 'every', 'always', 'never',
  'unlimited', 'infinite', 'maximum', 'minimum'
];

/**
 * Analyze text for missing context references
 */
export function findMissingContext(text) {
  const gaps = [];
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  sentences.forEach((sentence, index) => {
    CONTEXT_INDICATORS.forEach(indicator => {
      if (sentence.toLowerCase().includes(indicator.toLowerCase())) {
        // Check if the indicator has a clear antecedent
        const wordsBefore = sentence.split(indicator)[0].trim();
        if (wordsBefore.length < 10) { // Likely missing context
          gaps.push({
            category: 'missing_context',
            description: `Unclear reference to "${indicator}" in sentence ${index + 1}`,
            suggestion: `Specify what "${indicator}" refers to`,
            severity: 'medium'
          });
        }
      }
    });
  });
  
  return gaps;
}

/**
 * Analyze text for ambiguous requirements
 */
export function findAmbiguousRequirements(text) {
  const gaps = [];
  
  AMBIGUITY_INDICATORS.forEach(indicator => {
    if (text.toLowerCase().includes(indicator.toLowerCase())) {
      gaps.push({
        category: 'ambiguous_requirement',
        description: `Vague requirement: "${indicator}"`,
        suggestion: `Replace "${indicator}" with specific, measurable criteria`,
        severity: 'high'
      });
    }
  });
  
  return gaps;
}

/**
 * Analyze text for unclear output specifications
 */
export function findUnclearOutputs(text) {
  const gaps = [];
  
  OUTPUT_INDICATORS.forEach(indicator => {
    if (text.toLowerCase().includes(indicator.toLowerCase())) {
      gaps.push({
        category: 'unclear_output',
        description: `Unclear output: "${indicator}"`,
        suggestion: `Specify the exact format, structure, and content of the "${indicator}"`,
        severity: 'medium'
      });
    }
  });
  
  return gaps;
}

/**
 * Analyze text for missing constraints
 */
export function findMissingConstraints(text) {
  const gaps = [];
  
  CONSTRAINT_INDICATORS.forEach(indicator => {
    if (text.toLowerCase().includes(indicator.toLowerCase())) {
      gaps.push({
        category: 'missing_constraints',
        description: `Missing constraint: "${indicator}"`,
        suggestion: `Specify limits, boundaries, or specific criteria for "${indicator}"`,
        severity: 'medium'
      });
    }
  });
  
  return gaps;
}

/**
 * Calculate overall clarity score based on gap analysis
 */
export function calculateClarityScore(text, gaps) {
  const baseScore = 100;
  const penaltyPerGap = 15;
  const penaltyPerHighSeverity = 10;
  
  let score = baseScore;
  score -= gaps.length * penaltyPerGap;
  
  const highSeverityGaps = gaps.filter(gap => gap.severity === 'high');
  score -= highSeverityGaps.length * penaltyPerHighSeverity;
  
  // Bonus for longer, more detailed prompts
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 20) score += 5;
  if (wordCount > 50) score += 10;
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Main function to analyze text and find all clarity gaps
 */
export function analyzeTextForGaps(text) {
  const gaps = [
    ...findMissingContext(text),
    ...findAmbiguousRequirements(text),
    ...findUnclearOutputs(text),
    ...findMissingConstraints(text)
  ];
  
  // Remove duplicates based on description
  const uniqueGaps = gaps.filter((gap, index, self) => 
    index === self.findIndex(g => g.description === gap.description)
  );
  
  const clarityScore = calculateClarityScore(text, uniqueGaps);
  
  return {
    gaps: uniqueGaps,
    overall_clarity_score: clarityScore
  };
}

/**
 * Generate suggestions for improving prompt clarity
 */
export function generateClaritySuggestions(gaps) {
  const suggestions = [];
  
  if (gaps.some(gap => gap.category === 'missing_context')) {
    suggestions.push('Add specific context and background information');
  }
  
  if (gaps.some(gap => gap.category === 'ambiguous_requirement')) {
    suggestions.push('Use specific, measurable criteria instead of subjective terms');
  }
  
  if (gaps.some(gap => gap.category === 'unclear_output')) {
    suggestions.push('Specify exact output format, structure, and content requirements');
  }
  
  if (gaps.some(gap => gap.category === 'missing_constraints')) {
    suggestions.push('Define clear boundaries, limits, and constraints');
  }
  
  return suggestions;
}
