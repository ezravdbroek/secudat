# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro 5.15.4 project using the "Basics" starter template. It's a minimal static site generator setup with TypeScript support enabled.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server at localhost:4321
npm run dev

# Build production site to ./dist/
npm run build

# Preview production build locally
npm run preview

# Run Astro CLI commands
npm run astro [command]

# Get Astro CLI help
npm run astro -- --help
```

## Architecture

### Core Structure
- **Astro Framework**: Modern static site generator with island architecture
- **TypeScript**: Strict configuration enabled via astro/tsconfigs/strict
- **File-based Routing**: Pages in `src/pages/` automatically become routes
- **Component-based**: Uses `.astro` files which combine HTML, CSS, and JavaScript/TypeScript

### Directory Structure
- `src/pages/`: Route pages (file-based routing)
- `src/layouts/`: Reusable page layouts (wrappers for pages)
- `src/components/`: Reusable UI components
- `src/assets/`: Static assets (images, fonts, etc.)
- `public/`: Static files served directly (favicon, robots.txt, etc.)

### Key Files
- `astro.config.mjs`: Astro configuration (currently minimal default)
- `tsconfig.json`: TypeScript configuration extending Astro's strict preset
- `src/layouts/Layout.astro`: Base HTML layout with head, meta tags, and body structure

### Component System
- `.astro` files use frontmatter (---) for server-side JavaScript/TypeScript
- Components can import other components and modules
- Scoped CSS is supported within component files
- Slots allow content injection (used in Layout.astro)

## Development Notes

- The project uses Astro's default dev server port (4321)
- TypeScript strict mode is enabled
- No additional integrations or frameworks are currently configured
- The build output is static HTML/CSS/JS in the `dist/` directory