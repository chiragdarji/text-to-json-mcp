#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
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
    const { text } = request.params;
    if (!text) {
      return { success: false, error: "Text parameter is required" };
    }
    
    const result = convertPromptToJson(text);
    return result;
    
  } catch (error) {
    console.error('Error in convertPromptToJson:', error);
    return { success: false, error: error.message };
  }
});

// Method 2: Find clarity gaps in prompt
server.setRequestHandler('findClarityGaps', async (request) => {
  try {
    const { text } = request.params;
    if (!text) {
      return { success: false, error: "Text parameter is required" };
    }
    
    const gapAnalysis = analyzeTextForGaps(text);
    return {
      success: true,
      gaps: gapAnalysis.gaps,
      overall_clarity_score: gapAnalysis.overall_clarity_score
    };
    
  } catch (error) {
    console.error('Error in findClarityGaps:', error);
    return { success: false, error: error.message };
  }
});

// Method 3: Refine prompt for better clarity
server.setRequestHandler('refinePrompt', async (request) => {
  try {
    const { text } = request.params;
    if (!text) {
      return { success: false, error: "Text parameter is required" };
    }
    
    const result = refinePrompt(text);
    return result;
    
  } catch (error) {
    console.error('Error in refinePrompt:', error);
    return { success: false, error: error.message };
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
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.error('Text-to-JSON MCP Server started successfully');
    console.error('Available methods: convertPromptToJson, findClarityGaps, refinePrompt, health');
    
    // Keep the process alive
    process.stdin.resume();
    
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
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
