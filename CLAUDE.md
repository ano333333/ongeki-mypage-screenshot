# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a bookmarklet project for taking screenshots on the Ongeki MyPage. It uses TypeScript and Vite to build a minified JavaScript file that can be used as a bookmarklet, along with a GitHub Pages landing page for distribution.

## Build System Architecture

This project uses a **dual-build system** with two separate Vite configurations:

1. **vite.config.ts** - Builds the GitHub Pages landing page (`src/index.html` → `dist/index.html`)
   - Root is set to `src/` directory
   - Outputs HTML with inline styles and scripts

2. **vite.config.bookmarklet.ts** - Builds the bookmarklet script (`src/main.ts` → `dist/main.js`)
   - Uses Vite's library mode with IIFE format
   - Minifies with Terser (preserving console logs, removing comments)
   - **Critical**: `emptyOutDir: false` to avoid deleting the HTML built in step 1
   - Outputs a single-file JavaScript bundle with all imports inlined

The builds run sequentially via `pnpm build`, which executes both configurations in order.

## Development Commands

### Building

```bash
pnpm build              # Full build (HTML + bookmarklet)
pnpm build:html         # Build only the landing page
pnpm build:bookmarklet  # Build only the bookmarklet script
```

### Development

```bash
pnpm dev                # Start Vite dev server (for landing page)
pnpm preview            # Preview the production build
```

### Nix Environment

This project uses Nix flakes for reproducible development environment:

```bash
nix develop             # Enter the Nix development shell
direnv allow            # Auto-load Nix environment (if using direnv)
```

**Important**: When running commands in this project, always use `nix develop --command` prefix:

```bash
nix develop --command pnpm build              # Build the project
nix develop --command pnpm dev                # Start dev server
nix develop --command pnpm add <package>      # Add a package
```

This ensures all commands run with the correct Node.js and pnpm versions from the Nix environment.

**Package Management Rules**:

- `pnpm add <package> --save-dev`: Adding to devDependencies is allowed without user approval
- `pnpm add <package>`: Adding to dependencies requires user approval to minimize bundle size (affects bookmarklet code size)

## Key Implementation Details

### Landing Page (index.html)

- Contains a copy-to-clipboard button that copies the bookmarklet code
- Uses `navigator.clipboard.writeText()` to copy the JavaScript code
- Provides visual feedback when copy succeeds (button turns green for 2 seconds)
- The bookmarklet code dynamically loads `main.js` by injecting a script tag

### Bookmarklet (main.ts)

- Entry point for the bookmarklet functionality
- Must be written as an IIFE (Immediately Invoked Function Expression)
- Gets minified to a single line in `dist/main.js`
- Loaded dynamically when the bookmarklet is clicked

## Important Constraints

1. **Build Order Matters**: `build:html` must run before `build:bookmarklet` because the bookmarklet config has `emptyOutDir: false`

2. **Single File Output**: The bookmarklet MUST compile to exactly one file (`main.js`) with all dependencies inlined, as it's loaded dynamically via script injection

3. **GitHub Pages Deployment**: The `dist/` directory contains the deployable artifacts for GitHub Pages

## Commit Guidelines

This project follows the **Angular Commit Convention** with custom component scopes.

### Format

```
<type>(component): <subject>
```

### Components

- **playlog** - Changes related only to playlog screenshot functionality
- **front** - Changes related only to GitHub Pages landing page
- **ci** - Changes related only to CI/CD such as build configs and GitHub Actions
- **(omit component)** - Changes that don't fit the above categories (e.g., docs, general style changes)

### Examples

```bash
feat(playlog): Add screenshot selection feature
fix(front): Correct copy button feedback timing
docs: Update commit guidelines in CLAUDE.md
style: Format code with Prettier
refactor(playlog): Extract screenshot logic into separate module
chore: Update dependencies
```

### Best Practices

- **Keep commits small** - Avoid mixing different types or components in a single commit
- Use standard Angular types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, etc.
- Write clear, concise subject lines in imperative mood
