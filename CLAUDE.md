# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Magic Portfolio project built with Next.js 15, React 19, and Once UI. It's a personal portfolio website for Andrés Solem, a Full Stack Developer. The site features a blog, work portfolio, about page, and gallery, all driven by MDX content.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **UI Library**: Once UI System (@once-ui-system/core)
- **Content**: MDX files for blog posts and projects
- **Styling**: SCSS modules with Once UI design tokens
- **TypeScript**: Strict mode enabled

### Key Directories
- `/src/app/` - Next.js app router pages and API routes
- `/src/components/` - Reusable React components
- `/src/resources/` - Configuration and content files
  - `content.js` - Main content configuration (person info, social links, page content)
  - `once-ui.config.js` - UI theming, routes, and display settings
- `/src/app/blog/posts/` - MDX blog posts
- `/src/app/work/projects/` - MDX project descriptions
- `/public/images/` - Static images for projects, gallery, and profile

### Content Management
- Blog posts: Add `.mdx` files to `/src/app/blog/posts/`
- Projects: Add `.mdx` files to `/src/app/work/projects/`
- Personal info: Edit `/src/resources/content.js`
- UI configuration: Edit `/src/resources/once-ui.config.js`

### API Routes
- `/api/authenticate` - Password protection for routes
- `/api/og/generate` - Open Graph image generation
- `/api/rss` - RSS feed generation

### Environment Variables
Copy `.env.example` to `.env` for local development. Key variables include site URL, authentication secrets, and optional integrations (MongoDB, WhatsApp API, Cloudinary, SMTP).

### Protected Routes
Routes can be password-protected via `protectedRoutes` in `/src/resources/once-ui.config.js`. Authentication uses cookie-based sessions.

### Theme System
- Supports dark/light/system themes
- Customizable design tokens (brand, accent, neutral colors)
- Visual effects (gradients, dots, grid, lines) configurable in `once-ui.config.js`

## Git Workflow Policies

### **CRITICAL: Git Push Policy**
- **🚨 NEVER EVER push to remote repository without explicit user authorization**
- **🚨 ALWAYS ask "¿Puedo hacer push?" or "Can I push?" and WAIT for user confirmation**
- **🚨 Do NOT execute `git push` commands automatically, even if the user says "commit and push"**
- **🚨 Treat push requests as separate actions that require explicit permission**
- Only push when the user gives clear authorization like "yes, push" or "haz push"
- If unsure about push authorization, ASK FIRST

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

To add new projects to the portfolio:

1. **Capture screenshots** using the generic script:
   ```bash
   node scripts/capture-project-screenshots.cjs <url> <project-slug>
   # Example: node scripts/capture-project-screenshots.cjs https://example.com my-project
   ```

2. **Create MDX file** in `src/app/work/projects/<project-slug>.mdx` with:
   - Frontmatter metadata (title, date, summary, images, etc.)
   - Project description and details
   - Technologies used
   - Links to live demo and GitHub

3. **Images** will be automatically saved to `public/images/projects/<project-slug>/`