# Create NextJS structure
[In Powershell]
> npx create-next-app@latest

# Add a SPEC.md file 
Copy over SPEC.md from note-taking-app project. Just because I'm rebuilding and I want to keep the SPEC the same.
Normally I will generate one fresh with AI.

# Install few package I know I will need
[In IDE Terminal]
>npm install better-auth 
>npm install @prisma/client
>npm install -D prisma
>npx prisma init --datasource-provider sqlite
>npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-code-block-lowlight lowlight
>npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom

# Hook up to GitHub
Create a new repository
>git init
>git remote add origin https://github.com/ahctung/demo-note-taking-app-ralph.git
>git push -u origin main
