[![Bolt.new: AI-Powered Full-Stack Web Development in the Browser](./public/social_preview_index.jpg)](https://bolt.new)

# Bolt.new: AI-Powered Full-Stack Web Development in the Browser

Bolt.new is an AI-powered web development agent that allows you to prompt, run, edit, and deploy full-stack applications directly from your browser—no local setup required. If you're here to build your own AI-powered web dev agent using the Bolt open source codebase, [click here to get started!](./CONTRIBUTING.md)

## Milestones completed

- [x] Add images to prompt
- [x] Add model passthough via headers
- [x] Add system prompt from json file
- [x] Add downlaod as zip
- [x] Add more option on sidebar for chat items

## Still Needed

- [ ] Add a plugin system to add / remove (system prompt, llm provider, and tool provider)
- [ ] Add github pull / push
- [ ] Add load from local folder
- [ ] Add sync to local folder
- [ ] Add models load via json file along with api url
- [ ] Add the ability to pass the system prompt though the headers
- [ ] Add a test llm provider type for development testing
- [ ] Add a option to fix error during generation
- [ ] Super simple setting menu modal
- [ ] In base chat add 2 dropdown (model, system prompt)
- [ ] Remove all warnings
- [ ] Update dependencies

## Goals for our fork

- Keep with a minimal setup to reduce errors while developing the core codebase
- Add a plugin system to the system prompt, llm provider, and tool provider (this will reduce codebase that we have to maintain)

## What Makes Bolt.new Different

Bolt.new combines cutting-edge AI with powerful development capabilities:

- **Full-Stack Development in the Browser**: Powered by **StackBlitz's WebContainers**, Bolt.new provides:
  - Complete Node.js environment
  - Real-time package installation and management
  - Live server execution
  - Third-party API integration
  - One-click deployments
  - Instant project sharing

- **Modern Tech Stack**:
  - Built with Remix and React
  - Uses Vite for blazing-fast builds
  - CodeMirror for powerful code editing
  - Xterm.js for terminal emulation
  - UnoCSS for atomic CSS utilities
  - Cloudflare Pages for deployment

- **AI with Environment Control**: Unlike traditional AI coding assistants, Bolt.new gives AI models complete control over:
  - File system operations
  - Package management
  - Terminal commands
  - Server processes
  - Browser interactions
  - Deployment workflows

## Tips for Best Results

1. **Be Specific About Requirements**: Mention your preferred frameworks, libraries, or tools (React, Vue, Tailwind, etc.) in your initial prompt.

2. **Start with Core Features**: Build your application's foundation first before adding complex functionality.

3. **Use Clear Instructions**: Combine related tasks into single, well-structured prompts for efficiency.

4. **Leverage the Enhance Feature**: Use the prompt enhancement tool to refine your instructions before sending.

## Contributing

Interested in building AI-powered development tools? Check out our [Contributing Guide](./CONTRIBUTING.md) to get started with the Bolt.new codebase.
