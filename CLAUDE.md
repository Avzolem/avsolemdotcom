# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a portfolio website built with Next.js 15, React 19, and Tailwind CSS. It's a personal portfolio website for Andrés Aguilar, a Full Stack Developer. The site features a blog, work portfolio, about page, and gallery, all driven by MDX content.

## Development Commands

**IMPORTANT: This project uses Yarn as the package manager. Do NOT use npm.**

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Run linting
yarn lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with custom UI components
- **Content**: MDX files for blog posts and projects
- **Icons**: Lucide React
- **TypeScript**: Strict mode enabled

### Key Directories
- `/src/app/` - Next.js app router pages and API routes
- `/src/components/` - Reusable React components
- `/src/resources/` - Configuration and content files
  - `content.js` - Main content configuration (person info, social links, page content)
- `/src/components/ui/` - Reusable UI components (Flex, Text, Button, etc.)
- `/src/contexts/` - React context providers (ThemeContext)
- `/src/app/blog/posts/` - MDX blog posts
- `/src/app/work/projects/` - MDX project descriptions
- `/public/images/` - Static images for projects, gallery, and profile

### Content Management
- Blog posts: Add `.mdx` files to `/src/app/blog/posts/`
- Projects: Add `.mdx` files to `/src/app/work/projects/`
- Personal info: Edit `/src/resources/content.js`

### API Routes
- `/api/authenticate` - Password protection for routes
- `/api/og/generate` - Open Graph image generation
- `/api/rss` - RSS feed generation

### Environment Variables
Copy `.env.example` to `.env` for local development. Key variables include site URL, authentication secrets, and optional integrations (MongoDB, WhatsApp API, Cloudinary, SMTP).

### Protected Routes
Routes can be password-protected via the RouteGuard component. Authentication uses cookie-based sessions.

### Theme System
- Supports dark/light/system themes via ThemeContext
- Theme toggle persisted in localStorage
- Dark mode uses `[data-theme="dark"]` selector in Tailwind
- Custom CSS variables for consistent theming

## Git Workflow Policies

### **⛔ ABSOLUTE RULE - READ THIS FIRST ⛔**

```
╔════════════════════════════════════════════════════════════════════╗
║  NEVER EXECUTE `git push` WITHOUT USER SAYING "push", "haz push"  ║
║  OR SIMILAR EXPLICIT COMMAND. THIS IS NON-NEGOTIABLE.             ║
║                                                                    ║
║  EVEN IF THE USER SAYS "si" TO COMMIT, THAT DOES NOT MEAN PUSH.   ║
║  COMMIT AND PUSH ARE SEPARATE ACTIONS. ALWAYS ASK FOR BOTH.       ║
╚════════════════════════════════════════════════════════════════════╝
```

### **CRITICAL: Git Commit and Push Policy**
- **🚨 NEVER EVER commit or push without EXPLICIT user request**
- **🚨 DO NOT commit automatically, even when making fixes or changes**
- **🚨 DO NOT push to remote repository without explicit user authorization**
- **🚨 ALWAYS ask "¿Quieres que haga commit?" or "Should I commit?" BEFORE committing**
- **🚨 ALWAYS ask "¿Puedo hacer push?" or "Can I push?" BEFORE pushing**
- **🚨 WAIT for user confirmation before executing git commands**
- **🚨 Do NOT execute `git commit` or `git push` commands automatically**
- **🚨 Treat commit and push as COMPLETELY SEPARATE actions that each require explicit permission**
- **🚨 After a commit, STOP and ASK before pushing. Do NOT chain commit+push together.**
- Only commit when the user explicitly says "haz commit", "make a commit", "commit" or similar
- Only push when the user explicitly says "push", "haz push", "yes push", "sube los cambios" or similar
- If unsure about commit/push authorization, ASK FIRST
- **🚨 "si" or "yes" to a commit question does NOT authorize push - you must ask separately**

### **Commit Message Policy**  
- **DO NOT include Claude Code co-authorship in commits**
- **DO NOT add lines like:**
  ```
  🤖 Generated with [Claude Code](https://claude.ai/code)
  Co-Authored-By: Claude <noreply@anthropic.com>
  ```
- Use clean, descriptive commit messages focused on the actual changes
- Follow conventional commit format when appropriate

## Adding New Projects

**IMPORTANT: When creating a new route/feature for the site, ALWAYS automatically create a corresponding portfolio entry.**

When adding new projects or features to the portfolio:

1. **Create the route/feature** in `/src/app/<project-name>/`

2. **Automatically create portfolio entry** - This is mandatory for any new project:
   - Create MDX file in `src/app/work/projects/<project-slug>.mdx`
   - Include frontmatter: title, publishedAt, summary, images, team, category, tags, link
   - Write project overview, features, and technical details
   - The project will automatically appear in `/work` and the home page

3. **Capture screenshots** using Playwright or the generic script:
   ```bash
   # Using Playwright directly:
   npx playwright screenshot --viewport-size="1280,800" "http://localhost:3000/<route>" public/images/projects/<project-slug>/01-screenshot.png

   # Or using the generic script:
   node scripts/capture-project-screenshots.cjs <url> <project-slug>
   ```

4. **Images** should be saved to `public/images/projects/<project-slug>/`

### MDX Frontmatter Template
```mdx
---
title: "Project Name"
publishedAt: "YYYY-MM-DD"
summary: "Brief description of the project"
images:
  - "/images/projects/<slug>/01-screenshot.png"
team:
  - name: "Andres Aguilar"
    role: "Full Stack Developer"
    avatar: "/images/andres.jpeg"
    linkedIn: "https://www.linkedin.com/in/avsolem/"
category: "Web App"
tags: ["nextjs", "react", "typescript"]
link: "https://avsolem.com/<route>"
---
```