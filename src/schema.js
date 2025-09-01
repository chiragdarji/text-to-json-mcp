import { z } from 'zod';

// Main schema for converting prompts to structured JSON
export const PromptSchema = z.object({
  task: z.string().describe("A clear, concise description of what needs to be accomplished"),
  intent: z.string().describe("The underlying goal or purpose of the request"),
  inputs: z.object({
    required: z.array(z.string()).describe("Essential information or parameters needed"),
    optional: z.array(z.string()).describe("Helpful but not critical information"),
    constraints: z.array(z.string()).describe("Limitations, requirements, or boundaries")
  }),
  outputs: z.object({
    primary: z.string().describe("The main deliverable or result expected"),
    secondary: z.array(z.string()).describe("Additional outputs or side effects"),
    format: z.string().describe("Expected output format (e.g., JSON, CSV, HTML)")
  }),
  clarity_gaps: z.array(z.string()).describe("Areas where the prompt lacks detail or could be more specific")
});

// Schema for the convertPromptToJson method response
export const ConvertPromptResponseSchema = z.object({
  success: z.boolean(),
  data: PromptSchema.optional(),
  error: z.string().optional(),
  processing_time_ms: z.number()
});

// Schema for the findClarityGaps method response
export const ClarityGapsResponseSchema = z.object({
  success: z.boolean(),
  gaps: z.array(z.object({
    category: z.enum(['missing_context', 'ambiguous_requirement', 'unclear_output', 'missing_constraints']),
    description: z.string(),
    suggestion: z.string(),
    severity: z.enum(['low', 'medium', 'high'])
  })),
  overall_clarity_score: z.number().min(0).max(100)
});

// Schema for the refinePrompt method response
export const RefinePromptResponseSchema = z.object({
  success: z.boolean(),
  original_prompt: z.string(),
  refined_prompt: z.string(),
  improvements: z.array(z.object({
    type: z.enum(['clarity', 'specificity', 'structure', 'completeness']),
    description: z.string(),
    before: z.string(),
    after: z.string()
  }))
});

// Input schema for all methods
export const TextInputSchema = z.object({
  text: z.string().min(1, "Text input cannot be empty")
});

// Export types for TypeScript-like usage
export const schemas = {
  PromptSchema,
  ConvertPromptResponseSchema,
  ClarityGapsResponseSchema,
  RefinePromptResponseSchema,
  TextInputSchema
};

// Helper function to validate input against schemas
export function validateInput(schema, input) {
  try {
    return { success: true, data: schema.parse(input) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
