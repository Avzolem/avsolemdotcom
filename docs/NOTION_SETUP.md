# 📚 Complete Guide: Notion API Integration with Next.js Portfolio

> **Note:** This integration was implemented and later removed due to lack of real-time synchronization. This document serves as a complete reference for future implementations.

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Setup Process](#setup-process)
4. [Database Schemas](#database-schemas)
5. [Implementation Details](#implementation-details)
6. [Scripts and Commands](#scripts-and-commands)
7. [Lessons Learned](#lessons-learned)
8. [Why It Was Removed](#why-it-was-removed)

## Overview

This integration allowed managing portfolio content through Notion databases, providing:
- Blog post management
- Portfolio project management
- Contact form submissions storage
- Admin panel for synchronization
- CLI tools for content sync

### Technologies Used
- **Notion API Client**: @notionhq/client@2.2.15
- **MDX Processing**: gray-matter
- **Framework**: Next.js 15
- **Language**: JavaScript/TypeScript

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Notion    │────▶│   Next.js   │────▶│   MDX       │
│  Databases  │     │   API/Sync  │     │   Files     │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                    │                    │
       │                    ▼                    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Contact   │     │    Admin    │     │   Website   │
│    Forms    │     │    Panel    │     │   Display   │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Setup Process

### 1. Create Notion Integration

1. Navigate to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Create new integration with these permissions:
   - Read content
   - Update content
   - Insert content
3. Save the Internal Integration Token

### 2. Environment Configuration

```env
# .env.local
NOTION_API_KEY=secret_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NOTION_BLOG_DATABASE_ID=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
NOTION_PORTFOLIO_DATABASE_ID=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
NOTION_CONTACT_DATABASE_ID=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
```

### 3. Install Dependencies

```bash
npm install @notionhq/client@2.2.15 gray-matter dotenv
```

**Important:** Version 2.2.15 is required for `databases.query()` method support.

## Database Schemas

### Blog Posts Database

| Property | Type | Required | Description | Options |
|----------|------|----------|-------------|---------|
| Title | Title | Yes | Post title | - |
| Slug | Text | Yes | URL-friendly identifier | - |
| Summary | Text | Yes | Post excerpt | - |
| Content | Text | Yes | Main content (2000 char limit) | - |
| Published Date | Date | Yes | Publication date | - |
| Status | Select | Yes | Publication status | Draft, Published, Archived |
| Tags | Multi-select | No | Post categories | Development, Design, Tutorial, Personal |
| Featured Image | Files | No | Header image | - |
| SEO Title | Text | No | SEO meta title | - |
| SEO Description | Text | No | SEO meta description | - |

### Portfolio Projects Database

| Property | Type | Required | Description | Options |
|----------|------|----------|-------------|---------|
| Project Name | Title | Yes | Project title | - |
| Slug | Text | Yes | URL identifier | - |
| Description | Text | Yes | Short description | - |
| Long Description | Text | No | Detailed description | - |
| Technologies | Multi-select | Yes | Tech stack | React, Next.js, TypeScript, etc. |
| Status | Select | Yes | Project status | In Progress, Completed, Archived |
| Project URL | URL | No | Live demo link | - |
| GitHub URL | URL | No | Repository link | - |
| Date | Date | No | Project date | - |
| Featured | Checkbox | No | Featured project | - |
| Order | Number | No | Display order | - |
| Images | Files | No | Project screenshots | - |
| Category | Select | Yes | Project type | Web App, Mobile App, E-commerce, Open Source |

### Contact Form Submissions Database

| Property | Type | Required | Description | Options |
|----------|------|----------|-------------|---------|
| Name | Title | Yes | Contact name | - |
| Email | Email | Yes | Email address | - |
| Subject | Text | No | Message subject | - |
| Message | Text | Yes | Full message | - |
| Date | Date | Yes | Submission date | - |
| Status | Select | Yes | Response status | New, In Progress, Responded, Archived |
| Priority | Select | No | Message priority | Low, Medium, High, Urgent |
| Source | Select | Yes | Submission source | Website, Email, Social Media |
| Phone | Phone | No | Phone number | - |
| Company | Text | No | Company name | - |

## Implementation Details

### Core Library Structure

```
src/
├── lib/
│   ├── notion.js           # Notion client and basic operations
│   └── notion-sync.js       # Sync functions for content
├── app/
│   ├── api/
│   │   ├── contact/         # Contact form endpoint
│   │   └── sync/           # Sync endpoints
│   │       ├── blog/
│   │       └── portfolio/
│   ├── admin/              # Admin panel
│   └── contact/            # Contact form page
└── scripts/
    ├── sync-notion.cjs      # CLI sync tool
    └── migrate-to-notion.cjs # Migration script
```

### Key Functions

#### Query Database
```javascript
async function queryDatabase(databaseId, filter = {}, sorts = []) {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: filter,
    sorts: sorts,
  });
  return response.results;
}
```

#### Create Page (for contact forms)
```javascript
async function createPage(databaseId, properties) {
  const response = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: properties,
  });
  return response;
}
```

#### Sync Blog Posts
```javascript
async function syncBlogPosts() {
  const posts = await queryDatabase(databaseId, {
    property: 'Status',
    select: { equals: 'Published' }
  });
  
  for (const post of posts) {
    // Extract properties
    // Convert to MDX
    // Save to file system
  }
}
```

### API Rate Limits

- **Requests per second**: 3
- **Burst capacity**: 9 requests
- **Page size limit**: 100 items
- **Block children limit**: 100 blocks

## Scripts and Commands

### Package.json Scripts

```json
{
  "scripts": {
    "sync:notion": "node scripts/sync-notion.cjs all",
    "sync:blog": "node scripts/sync-notion.cjs blog",
    "sync:portfolio": "node scripts/sync-notion.cjs portfolio",
    "migrate:notion": "node scripts/migrate-to-notion.cjs"
  }
}
```

### CLI Usage

```bash
# Sync all content
npm run sync:notion

# Sync only blog posts
npm run sync:blog

# Sync only portfolio projects
npm run sync:portfolio

# Initial migration to Notion
npm run migrate:notion
```

## Lessons Learned

### What Worked Well

1. **Unified Content Management**: Single source of truth for all content
2. **Collaborative Editing**: Team members could edit content
3. **Rich Text Support**: Notion's editing capabilities
4. **Structured Data**: Database schemas enforced consistency

### Challenges Encountered

1. **No Real-Time Sync**: Required manual synchronization
2. **Image Handling**: Complex image migration and storage
3. **Content Limitations**: 2000 character limit for text fields
4. **Block Conversion**: Imperfect mapping between Notion blocks and MDX
5. **Performance**: Additional API calls increased build times

### Best Practices Discovered

1. **Batch Operations**: Process multiple items in single API calls
2. **Error Handling**: Implement retry logic for rate limits
3. **Caching**: Store Notion IDs to track changes
4. **Validation**: Verify data before writing to filesystem
5. **Backup**: Always backup before bulk operations

## Why It Was Removed

### Primary Reasons

1. **Lack of Real-Time Updates**
   - Changes in Notion required manual sync
   - No webhooks available for automatic updates
   - Created workflow friction

2. **Image Management Complexity**
   - Images stored in Notion couldn't be easily transferred
   - Required separate image hosting solution
   - Lost image references during sync

3. **Performance Overhead**
   - API calls added latency
   - Build times increased significantly
   - Rate limiting issues with large datasets

4. **Limited Content Formatting**
   - Notion blocks didn't map cleanly to MDX
   - Lost advanced MDX features
   - Code highlighting issues

5. **Maintenance Burden**
   - Complex sync logic to maintain
   - Version mismatch possibilities
   - Debugging sync issues

### Alternative Solutions

1. **Direct MDX Editing**
   - Simple and version controlled
   - Full MDX feature support
   - No sync required

2. **GitHub Web Editor**
   - Edit content directly in browser
   - Version control built-in
   - Collaborative through pull requests

3. **Purpose-Built CMS**
   - Contentful, Sanity, or Strapi
   - Real-time updates
   - Better image handling
   - Webhooks support

4. **Keystatic**
   - Git-based CMS
   - Visual editing
   - Local development
   - No external dependencies

## Migration Path

### From Notion to MDX

1. Run final sync from Notion
2. Verify all content transferred
3. Remove Notion dependencies
4. Clean up sync scripts
5. Update environment variables

### Preserving Content

```bash
# Backup current MDX files
cp -r src/app/blog/posts backup/blog
cp -r src/app/work/projects backup/work

# Remove Notion integration
npm uninstall @notionhq/client
rm -rf src/lib/notion*
rm -rf src/app/api/sync
rm -rf scripts/*notion*.cjs
```

## Conclusion

While the Notion integration provided a familiar editing interface and collaborative features, the technical limitations outweighed the benefits for a portfolio site. The lack of real-time synchronization and complex image handling made maintenance difficult.

For future projects, consider:
- Simple MDX for developer portfolios
- Purpose-built CMS for client projects
- Git-based CMS for team collaboration
- Static content for maximum performance

## Resources

- [Notion API Documentation](https://developers.notion.com/)
- [Notion API Client (npm)](https://www.npmjs.com/package/@notionhq/client)
- [Next.js Documentation](https://nextjs.org/docs)
- [MDX Documentation](https://mdxjs.com/)
- [Gray Matter (Frontmatter parser)](https://github.com/jonschlinkert/gray-matter)

---

*This documentation represents the complete implementation that was in production from January 14-15, 2025.*