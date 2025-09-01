#!/usr/bin/env node

/**
 * Text-to-JSON MCP Server
 * A local MCP server that converts text prompts to structured JSON using Zod schemas
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  ConvertPromptResponseSchema, 
  ClarityGapsResponseSchema, 
  RefinePromptResponseSchema,
  TextInputSchema 
} from './schema.js';
import { convertPromptToJson, refinePrompt } from '../utils/promptProcessor.js';
import { analyzeTextForGaps } from '../utils/gapAnalysis.js';

// Create MCP server instance
const server = new Server(
  {
    name: 'text-to-json-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Method 1: Convert prompt to structured JSON
server.setRequestHandler('convertPromptToJson', async (request) => {
  try {
    // Validate input
    const input = TextInputSchema.parse(request.params);
    const { text } = input;
    
    // Process the prompt
    const result = convertPromptToJson(text);
    
    // Validate output against schema
    const validatedResult = ConvertPromptResponseSchema.parse(result);
    
    return validatedResult;
    
  } catch (error) {
    console.error('Error in convertPromptToJson:', error);
    return {
      success: false,
      error: error.message,
      processing_time_ms: 0
    };
  }
});

// Method 2: Find clarity gaps in prompt
server.setRequestHandler('findClarityGaps', async (request) => {
  try {
    // Validate input
    const input = TextInputSchema.parse(request.params);
    const { text } = input;
    
    // Analyze for gaps
    const gapAnalysis = analyzeTextForGaps(text);
    
    // Format response
    const result = {
      success: true,
      gaps: gapAnalysis.gaps,
      overall_clarity_score: gapAnalysis.overall_clarity_score
    };
    
    // Validate output against schema
    const validatedResult = ClarityGapsResponseSchema.parse(result);
    
    return validatedResult;
    
  } catch (error) {
    console.error('Error in findClarityGaps:', error);
    return {
      success: false,
      gaps: [],
      overall_clarity_score: 0
    };
  }
});

// Method 3: Refine prompt for better clarity
server.setRequestHandler('refinePrompt', async (request) => {
  try {
    // Validate input
    const input = TextInputSchema.parse(request.params);
    const { text } = input;
    
    // Refine the prompt
    const result = refinePrompt(text);
    
    // Validate output against schema
    const validatedResult = RefinePromptResponseSchema.parse(result);
    
    return validatedResult;
    
  } catch (error) {
    console.error('Error in refinePrompt:', error);
    return {
      success: false,
      original_prompt: request.params.text || '',
      refined_prompt: '',
      improvements: []
    };
  }
});

// Health check method
server.setRequestHandler('health', async () => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  };
});

// Error handling
server.onError((error) => {
  console.error('MCP Server Error:', error);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('Text-to-JSON MCP Server started');
  console.error('Available methods: convertPromptToJson, findClarityGaps, refinePrompt, health');
}

// Handle process termination
process.on('SIGINT', () => {
  console.error('Shutting down MCP server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('Shutting down MCP server...');
  process.exit(0);
});

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  });
}

export default server;
