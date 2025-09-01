#!/usr/bin/env node

/**
 * CLI entrypoint for text-to-json-mcp
 * Usage: npx text-to-json-mcp [command] [options]
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { convertPromptToJson, refinePrompt } from './utils/promptProcessor.js';
import { analyzeTextForGaps } from './utils/gapAnalysis.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json for version info
const packageJson = JSON.parse(
  readFileSync(join(__dirname, 'package.json'), 'utf8')
);

function showHelp() {
  console.log(`
Text-to-JSON MCP Server v${packageJson.version}

A local MCP server that converts text prompts to structured JSON using Zod schemas.

USAGE:
  npx text-to-json-mcp [command] [options]

COMMANDS:
  convert <text>          Convert text prompt to structured JSON
  gaps <text>             Find clarity gaps in text prompt
  refine <text>           Refine text prompt for better clarity
  server                  Start MCP server (for IDE integration)
  help                    Show this help message
  version                 Show version information

EXAMPLES:
  npx text-to-json-mcp convert "Generate a product catalog for corrugated boxes"
  npx text-to-json-mcp gaps "Make something good"
  npx text-to-json-mcp refine "Build a website"
  npx text-to-json-mcp server

OPTIONS:
  --help, -h             Show help message
  --version, -v          Show version information

For IDE integration (Cursor/VSCode), use the 'server' command and configure MCP.
See README.md for detailed setup instructions.
`);
}

function showVersion() {
  console.log(`text-to-json-mcp v${packageJson.version}`);
}

function processText(text, command) {
  if (!text || text.trim().length === 0) {
    console.error('Error: Text input is required');
    process.exit(1);
  }

  try {
    let result;
    
    switch (command) {
      case 'convert':
        result = convertPromptToJson(text);
        break;
      case 'gaps':
        result = analyzeTextForGaps(text);
        break;
      case 'refine':
        result = refinePrompt(text);
        break;
      default:
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }

    if (result.success === false) {
      console.error('Error:', result.error);
      process.exit(1);
    }

    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Error processing text:', error.message);
    process.exit(1);
  }
}

async function startServer() {
  console.log('Starting MCP server...');
  console.log('This server is designed to run as a background process for IDE integration.');
  console.log('Use Ctrl+C to stop the server.');
  
  try {
    // Import and start the MCP server
    const { fileURLToPath } = await import('url');
    const { dirname, join } = await import('path');
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const serverPath = join(__dirname, 'src', 'index.js');
    
    console.log(`Loading MCP server from: ${serverPath}`);
    await import(serverPath);
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  if (args.includes('--version') || args.includes('-v')) {
    showVersion();
    return;
  }
  
  const command = args[0];
  
  switch (command) {
    case 'help':
      showHelp();
      break;
    case 'version':
      showVersion();
      break;
    case 'server':
      await startServer();
      break;
    case 'convert':
    case 'gaps':
    case 'refine':
      if (args.length < 2) {
        console.error(`Error: ${command} requires text input`);
        console.error(`Usage: npx text-to-json-mcp ${command} "your text here"`);
        process.exit(1);
      }
      // Join remaining args as the text input
      const text = args.slice(1).join(' ');
      processText(text, command);
      break;
    default:
      console.error(`Unknown command: ${command}`);
      console.error('Run "npx text-to-json-mcp help" for usage information');
      process.exit(1);
  }
}

// Run the CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
