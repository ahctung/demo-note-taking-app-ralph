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

# Generate a tasks.json for RALPH loop
[Claude]>   I want to implment a list of tasks that I can tackle via a RALPH loop. Can you have a look at @SPEC.md and generate a tasks.json file for me, for a list of tasks that would represent the complete app.
            Each task in this json file should have these attributes:
            category - ui, auth, database etc
            description - the feature to be implemented
            steps - a list of items for the feature to be implemented
            passes - a boolean showing if the feature has been completed or not

# Setup files for RALPH loop
[Claude]> Now to implement RALPH loop and start building the app, what are the files that needs to be created? Can you help me create them?
(Ohh.. when I do this, Claude generated a /ralph command which bascially has instruction to go down the list of tasks.json and implement one by one. )
(This is interesting, but it's not what I had in mind. I wanted to follow the course and use a .sh method)
(So I will reject this edits, and manaully copy the files from Course Material instead)
(interestingly when I cancel, Claude does try to work with me on other approach, and provided a .sh version which essentially does above. Still going to follow the course example)

# Manually setup files for RALPH
## Copied over files:
    RALPH.md
    ralph.sh
    agent-progress.txt

## Update all reference of prd.json to tasks.json
## Initialize agent-progress.txt
[Claude]> Can you update agent-progress.txt, under "Project initialized with:" line, with a summary snapshot of the main testchstack and version that we have installed and setup so far. Example NextJS, Vitest etc.
## Fix use of bun
[Claude]> In @ralph.sh , can you fix up any reference to usage of "bun". I do not use "bun" in this app. Please fix it to whatever that is more appropriate and applies to the project 

## Turn on Sandbox in Claude
I moved the project to run in WSL. 
/sandbox command is now avialable
selected "Sandbox BashTool, with auto-allow"
Can see this added an entry in setings.local.json
