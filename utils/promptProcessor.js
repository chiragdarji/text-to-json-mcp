/**
 * Utility functions for processing text prompts and converting them to structured JSON
 */

import { analyzeTextForGaps, generateClaritySuggestions } from './gapAnalysis.js';

/**
 * Extract task description from text
 */
function extractTask(text) {
  // Look for action verbs at the beginning
  const actionVerbs = [
    'generate', 'create', 'build', 'make', 'develop', 'design', 'implement',
    'write', 'produce', 'construct', 'assemble', 'compile', 'organize'
  ];
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const firstSentence = sentences[0].trim();
  
  // Check if first sentence starts with an action verb
  for (const verb of actionVerbs) {
    if (firstSentence.toLowerCase().startsWith(verb.toLowerCase())) {
      return firstSentence;
    }
  }
  
  // If no clear action verb, return the first sentence
  return firstSentence;
}

/**
 * Extract intent from text
 */
function extractIntent(text) {
  // Look for intent indicators
  const intentIndicators = [
    'to', 'for', 'so that', 'in order to', 'because', 'since',
    'as', 'while', 'when', 'if', 'although'
  ];
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  for (const sentence of sentences) {
    for (const indicator of intentIndicators) {
      if (sentence.toLowerCase().includes(indicator.toLowerCase())) {
        const parts = sentence.split(indicator);
        if (parts.length > 1) {
          return parts[1].trim();
        }
      }
    }
  }
  
  // Default intent based on task
  return "To fulfill the specified requirements and deliver the requested output";
}

/**
 * Extract required inputs from text
 */
function extractRequiredInputs(text) {
  const required = [];
  
  // Look for specific data requirements
  const dataPatterns = [
    /(\w+)\s+data/i,
    /(\w+)\s+information/i,
    /(\w+)\s+details/i,
    /(\w+)\s+specifications/i
  ];
  
  dataPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      required.push(`${matches[1]} data/information`);
    }
  });
  
  // Look for specific parameters
  const paramPatterns = [
    /(\w+)\s+parameters/i,
    /(\w+)\s+criteria/i,
    /(\w+)\s+requirements/i
  ];
  
  paramPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      required.push(`${matches[1]} parameters/criteria`);
    }
  });
  
  // If no specific inputs found, add generic ones
  if (required.length === 0) {
    required.push("Input text or prompt");
    required.push("Context or background information");
  }
  
  return required;
}

/**
 * Extract optional inputs from text
 */
function extractOptionalInputs(text) {
  const optional = [];
  
  // Look for optional indicators
  const optionalPatterns = [
    /optional\s+(\w+)/gi,
    /if\s+available\s+(\w+)/gi,
    /(\w+)\s+\(optional\)/gi
  ];
  
  optionalPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      optional.push(match[1]);
    }
  });
  
  // Add common optional inputs
  optional.push("Additional context");
  optional.push("Preferences or style guidelines");
  
  return optional;
}

/**
 * Extract constraints from text
 */
function extractConstraints(text) {
  const constraints = [];
  
  // Look for constraint indicators
  const constraintPatterns = [
    /within\s+(\w+)/gi,
    /limit\s+(\w+)/gi,
    /maximum\s+(\w+)/gi,
    /minimum\s+(\w+)/gi,
    /only\s+(\w+)/gi,
    /must\s+(\w+)/gi,
    /should\s+(\w+)/gi
  ];
  
  constraintPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      constraints.push(`${pattern.source.replace(/[()]/g, '')} ${match[1]}`);
    }
  });
  
  // Add common constraints
  constraints.push("Available time and resources");
  constraints.push("Technical limitations");
  
  return constraints;
}

/**
 * Extract output specifications from text
 */
function extractOutputs(text) {
  const outputs = {
    primary: "",
    secondary: [],
    format: "JSON" // Default format
  };
  
  // Look for output format indicators
  const formatPatterns = [
    /(\w+)\s+format/i,
    /(\w+)\s+file/i,
    /(\w+)\s+output/i
  ];
  
  formatPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      outputs.format = matches[1];
    }
  });
  
  // Look for specific output types
  const outputTypes = [
    'report', 'summary', 'analysis', 'list', 'catalog', 'database',
    'dashboard', 'interface', 'document', 'presentation'
  ];
  
  for (const type of outputTypes) {
    if (text.toLowerCase().includes(type.toLowerCase())) {
      outputs.primary = `${type.charAt(0).toUpperCase() + type.slice(1)}`;
      break;
    }
  }
  
  // If no specific output found, infer from task
  if (!outputs.primary) {
    outputs.primary = "Structured data or information";
  }
  
  // Add secondary outputs
  outputs.secondary = [
    "Documentation or instructions",
    "Quality assurance metrics"
  ];
  
  return outputs;
}

/**
 * Main function to convert text prompt to structured JSON
 */
export function convertPromptToJson(text) {
  const startTime = Date.now();
  
  try {
    // Extract structured information
    const task = extractTask(text);
    const intent = extractIntent(text);
    const inputs = {
      required: extractRequiredInputs(text),
      optional: extractOptionalInputs(text),
      constraints: extractConstraints(text)
    };
    const outputs = extractOutputs(text);
    
    // Analyze for clarity gaps
    const gapAnalysis = analyzeTextForGaps(text);
    const clarity_gaps = gapAnalysis.gaps.map(gap => gap.description);
    
    const result = {
      task,
      intent,
      inputs,
      outputs,
      clarity_gaps
    };
    
    const processing_time_ms = Date.now() - startTime;
    
    return {
      success: true,
      data: result,
      processing_time_ms
    };
    
  } catch (error) {
    const processing_time_ms = Date.now() - startTime;
    
    return {
      success: false,
      error: error.message,
      processing_time_ms
    };
  }
}

/**
 * Generate refined version of a prompt
 */
export function refinePrompt(text) {
  const gapAnalysis = analyzeTextForGaps(text);
  const suggestions = generateClaritySuggestions(gapAnalysis.gaps);
  
  let refinedText = text;
  const improvements = [];
  
  // Apply improvements based on gap analysis
  if (gapAnalysis.gaps.some(gap => gap.category === 'missing_context')) {
    const before = refinedText;
    refinedText = `Context: This request is for [specify context]. ${refinedText}`;
    improvements.push({
      type: 'clarity',
      description: 'Added context section',
      before,
      after: refinedText
    });
  }
  
  if (gapAnalysis.gaps.some(gap => gap.category === 'ambiguous_requirement')) {
    const before = refinedText;
    refinedText = refinedText.replace(/\b(good|better|best|nice|pretty|cool)\b/gi, 'specific and measurable');
    improvements.push({
      type: 'specificity',
      description: 'Replaced subjective terms with objective criteria',
      before,
      after: refinedText
    });
  }
  
  if (gapAnalysis.gaps.some(gap => gap.category === 'unclear_output')) {
    const before = refinedText;
    refinedText = `${refinedText} The output should be in [specific format] with [specific structure] and include [specific content].`;
    improvements.push({
      type: 'structure',
      description: 'Added specific output requirements',
      before,
      after: refinedText
    });
  }
  
  if (gapAnalysis.gaps.some(gap => gap.category === 'missing_constraints')) {
    const before = refinedText;
    refinedText = `${refinedText} Constraints: [specify time limits, resource constraints, technical limitations].`;
    improvements.push({
      type: 'completeness',
      description: 'Added constraints section',
      before,
      after: refinedText
    });
  }
  
  return {
    success: true,
    original_prompt: text,
    refined_prompt: refinedText,
    improvements
  };
}
