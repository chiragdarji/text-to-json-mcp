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
npx text-to-json-mcp convert "Create a user authentication system with login and registration"

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

**Input**: `"Create a user authentication system with login and registration"`

**Output**:
```json
{
  "success": true,
  "data": {
    "task": "Create a user authentication system with login and registration",
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
      "Missing specific authentication methods (JWT, OAuth, etc.)",
      "Unclear user data requirements and validation",
      "Missing security requirements and password policies"
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
   /mcp text-to-json-mcp convertPromptToJson "Create a user authentication system with login and registration"
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
- **Real-time Development**: Structure requirements and tasks during active coding sessions

## Real-Time Software Development Examples

### Example 1: Feature Development During Active Coding

**Scenario**: You're in the middle of building a user authentication system when your team lead asks you to add a new feature.

**Raw Request**: *"We need to add password reset functionality to the auth system. Users should be able to request a reset link via email and set a new password. Make sure it's secure and follows our existing patterns."*

**Using text-to-json-mcp in Cursor**:
```
/mcp text-to-json-mcp convertPromptToJson "We need to add password reset functionality to the auth system. Users should be able to request a reset link via email and set a new password. Make sure it's secure and follows our existing patterns."
```

**Structured Output**:
```json
{
  "success": true,
  "data": {
    "task": "Add password reset functionality to the auth system",
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
      "primary": "System",
      "secondary": [
        "Documentation or instructions",
        "Quality assurance metrics"
      ],
      "format": "JSON"
    },
    "clarity_gaps": [
      "Missing specific security requirements (token expiration, rate limiting)",
      "Unclear email template requirements",
      "Missing integration points with existing auth flow"
    ]
  },
  "processing_time_ms": 12
}
```

**Next Step - Find Clarity Gaps**:
```
/mcp text-to-json-mcp findClarityGaps "We need to add password reset functionality to the auth system. Users should be able to request a reset link via email and set a new password. Make sure it's secure and follows our existing patterns."
```

**Gap Analysis Output**:
```json
{
  "success": true,
  "gaps": [
    {
      "category": "missing_constraints",
      "description": "Missing constraint: \"secure\"",
      "suggestion": "Specify limits, boundaries, or specific criteria for \"secure\"",
      "severity": "high"
    },
    {
      "category": "unclear_output",
      "description": "Unclear output: \"system\"",
      "suggestion": "Specify the exact format, structure, and content of the \"system\"",
      "severity": "medium"
    }
  ],
  "overall_clarity_score": 70
}
```

**Final Step - Refine the Request**:
```
/mcp text-to-json-mcp refinePrompt "We need to add password reset functionality to the auth system. Users should be able to request a reset link via email and set a new password. Make sure it's secure and follows our existing patterns."
```

**Refined Output**:
```json
{
  "success": true,
  "original_prompt": "We need to add password reset functionality to the auth system...",
  "refined_prompt": "Context: This request is for adding password reset functionality to an existing authentication system. We need to add password reset functionality to the auth system. Users should be able to request a reset link via email and set a new password. The output should be in [specific format] with [specific structure] and include [specific content]. Constraints: [specify time limits, resource constraints, technical limitations].",
  "improvements": [
    {
      "type": "clarity",
      "description": "Added context section",
      "before": "We need to add password reset functionality...",
      "after": "Context: This request is for adding password reset functionality to an existing authentication system. We need to add password reset functionality..."
    },
    {
      "type": "structure",
      "description": "Added specific output requirements",
      "before": "Make sure it's secure and follows our existing patterns.",
      "after": "The output should be in [specific format] with [specific structure] and include [specific content]."
    },
    {
      "type": "completeness",
      "description": "Added constraints section",
      "before": "Make sure it's secure and follows our existing patterns.",
      "after": "Constraints: [specify time limits, resource constraints, technical limitations]."
    }
  ]
}
```

### Example 2: Bug Fix During Debugging Session

**Scenario**: You're debugging a production issue and need to quickly structure the problem description for your team.

**Raw Request**: *"The login API is returning 500 errors for some users. It seems to happen when they have special characters in their email addresses. We need to fix this ASAP because it's blocking customer access."*

**Using text-to-json-mcp**:
```
/mcp text-to-json-mcp convertPromptToJson "The login API is returning 500 errors for some users. It seems to happen when they have special characters in their email addresses. We need to fix this ASAP because it's blocking customer access."
```

**Structured Output**:
```json
{
  "success": true,
  "data": {
    "task": "Fix login API 500 errors for users with special characters in email addresses",
    "intent": "To resolve production blocking issue and restore customer access",
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
      "primary": "API",
      "secondary": [
        "Documentation or instructions",
        "Quality assurance metrics"
      ],
      "format": "JSON"
    },
    "clarity_gaps": [
      "Missing specific error details and stack traces",
      "Unclear which special characters are problematic",
      "Missing user impact metrics and urgency level"
    ]
  },
  "processing_time_ms": 8
}
```

### Example 3: Code Review Feedback Structuring

**Scenario**: You're reviewing a pull request and want to structure your feedback systematically.

**Raw Request**: *"The error handling in this service layer is inconsistent. Some methods return null, others throw exceptions, and some return empty objects. We should standardize this across all methods."*

**Using text-to-json-mcp**:
```
/mcp text-to-json-mcp convertPromptToJson "The error handling in this service layer is inconsistent. Some methods return null, others throw exceptions, and some return empty objects. We should standardize this across all methods."
```

**Structured Output**:
```json
{
  "success": true,
  "data": {
    "task": "Standardize error handling across service layer methods",
    "intent": "To create consistent error handling patterns for better maintainability",
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
      "primary": "Layer",
      "secondary": [
        "Documentation or instructions",
        "Quality assurance metrics"
      ],
      "format": "JSON"
    },
    "clarity_gaps": [
      "Missing specific error handling strategy (null vs exceptions vs empty objects)",
      "Unclear scope of methods to be updated",
      "Missing migration plan for existing code"
    ]
  },
  "processing_time_ms": 10
}
```

### Example 4: Sprint Planning and Task Breakdown

**Scenario**: During sprint planning, you need to quickly structure a new feature request from stakeholders.

**Raw Request**: *"We need a dashboard that shows user analytics including login frequency, feature usage, and retention metrics. It should be real-time and exportable to CSV. The design team wants it to match our new design system."*

**Using text-to-json-mcp**:
```
/mcp text-to-json-mcp convertPromptToJson "We need a dashboard that shows user analytics including login frequency, feature usage, and retention metrics. It should be real-time and exportable to CSV. The design team wants it to match our new design system."
```

**Structured Output**:
```json
{
  "success": true,
  "data": {
    "task": "Create user analytics dashboard with real-time data and CSV export",
    "intent": "To provide stakeholders with comprehensive user behavior insights",
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
      "primary": "Dashboard",
      "secondary": [
        "Documentation or instructions",
        "Quality assurance metrics"
      ],
      "format": "JSON"
    },
    "clarity_gaps": [
      "Missing specific metrics calculation methods",
      "Unclear real-time update frequency requirements",
      "Missing design system component specifications",
      "Missing data retention and privacy requirements"
    ]
  },
  "processing_time_ms": 15
}
```

### Benefits of Real-Time Usage

1. **Immediate Structure**: Convert vague requests into actionable tasks in seconds
2. **Gap Identification**: Spot missing requirements before starting development
3. **Team Communication**: Provide structured feedback during code reviews
4. **Sprint Planning**: Break down features into clear, measurable tasks
5. **Documentation**: Generate consistent task descriptions for project management tools
6. **Quality Assurance**: Identify unclear specifications before they become bugs
7. **Onboarding**: Help new team members understand requirements quickly
8. **Stakeholder Alignment**: Ensure everyone has the same understanding of requests

### Integration with Development Workflow

- **During Standups**: Quickly structure feature requests and bug reports
- **Code Reviews**: Structure feedback and improvement suggestions
- **Sprint Planning**: Break down epics into actionable stories
- **Bug Triage**: Structure issue descriptions for better tracking
- **API Design**: Structure endpoint requirements and specifications
- **Testing**: Structure test case requirements and acceptance criteria

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
