# Text-to-JSON MCP Server

A local MCP (Model Context Protocol) server that converts text prompts to structured JSON using Zod schemas. This tool helps developers and AI assistants structure unstructured text into well-defined, validated data structures.

## Features

- **Convert Prompt to JSON**: Transform natural language prompts into structured JSON with task, intent, inputs, outputs, and clarity gaps
- **Find Clarity Gaps**: Identify missing details, ambiguities, and areas for improvement in text prompts
- **Refine Prompts**: Generate clearer, more specific versions of input prompts
- **Local-First**: Runs entirely on your local machine with no cloud dependencies
- **IDE Integration**: Seamlessly integrates with Cursor, VSCode, and other MCP-compatible editors
- **CLI Interface**: Command-line interface for quick text processing and testing

## Installation

### Local Development

```bash
# Clone the repository
git clone https://github.com/chiragdarji/text-to-json-mcp.git
cd text-to-json-mcp

# Install dependencies
npm install

# Start development server
npm run dev
```

### Global Installation

```bash
# Install globally
npm install -g text-to-json-mcp

# Or use npx (recommended)
npx text-to-json-mcp --help
```

## Usage

### CLI Commands

```bash
# Convert text to structured JSON
npx text-to-json-mcp convert "Generate a product catalog for corrugated boxes with pricing and specs"

# Find clarity gaps in text
npx text-to-json-mcp gaps "Make something good"

# Refine text for better clarity
npx text-to-json-mcp refine "Build a website"

# Start MCP server for IDE integration
npx text-to-json-mcp server

# Show help
npx text-to-json-mcp help
```

### Example Output

**Input**: `"Generate a product catalog for corrugated boxes with pricing and specs"`

**Output**:
```json
{
  "success": true,
  "data": {
    "task": "Generate a product catalog for corrugated boxes with pricing and specs",
    "intent": "To fulfill the specified requirements and deliver the requested output",
    "inputs": {
      "required": [
        "Input text or prompt",
        "Context or background information"
      ],
      "optional": [
        "Additional context",
        "Preferences or style guidelines"
      ],
      "constraints": [
        "Available time and resources",
        "Technical limitations"
      ]
    },
    "outputs": {
      "primary": "Catalog",
      "secondary": [
        "Documentation or instructions",
        "Quality assurance metrics"
      ],
      "format": "JSON"
    },
    "clarity_gaps": [
      "Missing specific product categories or types",
      "Unclear pricing structure requirements",
      "Missing technical specifications details"
    ]
  },
  "processing_time_ms": 15
}
```

## MCP Integration

### Cursor IDE Setup

1. **Install the package**:
   ```bash
   npm install -g text-to-json-mcp
   ```

2. **Configure MCP in Cursor**:
   - Open Cursor settings
   - Navigate to MCP configuration
   - Add the following configuration:

   ```json
   {
     "mcpServers": {
       "text-to-json-mcp": {
         "command": "npx",
         "args": ["text-to-json-mcp", "server"],
         "env": {}
       }
     }
   }
   ```

3. **Restart Cursor** to load the MCP server

4. **Use in Cursor**:
   ```
   /mcp text-to-json-mcp convertPromptToJson "Generate a product catalog for corrugated boxes with pricing and specs"
   ```

### VSCode Setup

1. Install the MCP extension for VSCode
2. Configure the MCP server in your workspace settings
3. Use the same configuration format as above

## API Methods

### 1. `convertPromptToJson`

Converts raw text to structured JSON.

**Input**: `{ "text": "your prompt here" }`

**Output**: Structured JSON with task, intent, inputs, outputs, and clarity gaps.

### 2. `findClarityGaps`

Identifies missing details or ambiguities in the prompt.

**Input**: `{ "text": "your prompt here" }`

**Output**: Array of clarity gaps with categories, descriptions, suggestions, and severity levels.

### 3. `refinePrompt`

Suggests a clearer version of the input prompt.

**Input**: `{ "text": "your prompt here" }`

**Output**: Original prompt, refined prompt, and list of improvements made.

## Development

### Project Structure

```
text-to-json-mcp/
├── src/
│   └── index.js          # Main MCP server implementation
├── utils/
│   ├── gapAnalysis.js    # Text analysis utilities
│   └── promptProcessor.js # Prompt processing logic
├── schema.js             # Zod schema definitions
├── cli.js                # CLI entrypoint
├── package.json          # Package configuration
├── README.md             # This file
├── LICENSE               # MIT license
└── mcp.json             # Example MCP configuration
```

### Available Scripts

```bash
npm start          # Start the MCP server
npm run dev        # Start with nodemon for development
npm test           # Run tests
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

### Adding New Methods

1. Define the schema in `schema.js`
2. Implement the logic in appropriate utility files
3. Add the method handler in `src/index.js`
4. Update the CLI interface in `cli.js`
5. Add tests and documentation

## Publishing to NPM

### Prerequisites

1. **NPM Account**: Create an account at [npmjs.com](https://www.npmjs.com)
2. **Login**: `npm login` in your terminal
3. **Package Name**: Ensure the package name is available

### Publishing Steps

```bash
# 1. Test the package locally
npm install -g .

# 2. Test CLI functionality
text-to-json-mcp --help

# 3. Update version (patch, minor, or major)
npm version patch

# 4. Publish to npm
npm publish --access public
```

### Version Management

```bash
npm version patch   # 1.0.0 → 1.0.1 (bug fixes)
npm version minor   # 1.0.0 → 1.1.0 (new features)
npm version major   # 1.0.0 → 2.0.0 (breaking changes)
```

## Use Cases

- **AI Prompt Engineering**: Structure and validate prompts before sending to AI models
- **Requirements Analysis**: Convert natural language requirements into structured formats
- **Documentation**: Generate consistent documentation templates from text descriptions
- **Quality Assurance**: Identify unclear or incomplete specifications
- **Team Collaboration**: Standardize communication formats across development teams

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/chiragdarji/text-to-json-mcp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/chiragdarji/text-to-json-mcp/discussions)
- **Documentation**: [GitHub Wiki](https://github.com/chiragdarji/text-to-json-mcp/wiki)

## Roadmap

- [ ] Support for multiple output formats (YAML, XML, etc.)
- [ ] Custom schema definitions
- [ ] Batch processing capabilities
- [ ] Integration with popular AI platforms
- [ ] Web interface for non-technical users
- [ ] Plugin system for custom analyzers
