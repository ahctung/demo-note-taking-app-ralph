# Create NextJS structure
[Powershell]> npx create-next-app@latest

# Add a SPEC.md file 
Copy over SPEC.md from note-taking-app project. Just because I'm rebuilding and I want to keep the SPEC the same.
Normally I will generate one fresh with AI.

# Install few package I know I will need
[Terminal]>npm install better-auth 
[Terminal]>npm install @prisma/client
[Terminal]>npm install -D prisma
[Terminal]>npx prisma init --datasource-provider sqlite
[Terminal]>npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-code-block-lowlight lowlight
[Terminal]>npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom

# Hook up to GitHub
Create a new repository
[Terminal]> git init
[Terminal]> git remote add origin https://github.com/ahctung/demo-note-taking-app-ralph.git
[Terminal]> git push -u origin main

# Create initial CLAUDE.md file
[Claude]> /init

added some extra instructions in Preamble

"We're building the app described in @SPEC.md. Read that file for general architectural tasks or to double-check the exact database structure, tech stack or application architecture."

"Keep your replies extremly concise and focus on converying the key information. No unnecessry fluff, no long code snippets."

"Whenever working with any third-party library or something similar, you MUST look up the official documentation to ensure that you're working with up-to-date information.
Use the DocExplorer subagent for efficient documentation lookup."


# setup Context7 MCP
(actually already installed globally, so availalable in /mcp already)

# Setup useful SubAgents and Skills
SubAgent
    DocsExplorer.md
Skills
    clean-typescript
    code-review
    modern-accessible-html-jsx
    modern-best-practice-nextjs
    modern-best-practice-react-components
    modern-browser-apis
    modern-tailwind
    web-security

# Get Claude to implement TDD
[Claude]❯ Can you update CLAUDE.md with instructions to tell yourself to implement TDD approach. For every feature/task you are about to implement, write unittests first (the tests are expected to fail at first), then implement the relevant feature, and then confirm the unittests passes. 

# install Playwright plugin
[Claude]> /plugin
    (actually already installed to Claude, but fails to connect to Playwright MCP)
    (looks like it's the certificate issue, and Claude Code couldn't run npx to kick off Playwright MCP to connect to. To fix, added use-system-ca to global claude settings.json, hopefully fix for good)

# install typescript-lsp plugin
[Claude]> /plugin
Select typescript-lsp, install at project level

# Install Zod for validation
[Claude]> I want to use Zod for Validation, please update in CLAUDE.md with instructions. Also provide the npm command to install zod.
[Terminal]> npm install zod     (actually should add this to the package install at beginning)

