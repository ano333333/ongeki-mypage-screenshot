# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a bookmarklet project for taking screenshots on the Ongeki MyPage. It uses TypeScript and Vite to build a minified JavaScript file that can be used as a bookmarklet, along with a GitHub Pages landing page for distribution.

## Build System Architecture

This project uses a **triple-build system** with three separate Vite configurations:

1. **vite.config.ts** - Builds the GitHub Pages landing page (`src/index.html` → `dist/index.html`)
   - Root is set to `src/` directory
   - Outputs HTML with inline styles and scripts
   - Reads `dist/embed.js` and injects it as the bookmarklet code (URL-encoded)

2. **vite.config.bookmarklet.ts** - Builds the main bookmarklet script (`src/main.ts` → `dist/main.js`)
   - Uses Vite's library mode with IIFE format
   - Minifies with Terser (preserving console logs, removing comments)
   - `emptyOutDir: false` to avoid deleting other build outputs
   - Outputs a single-file JavaScript bundle with all dependencies inlined

3. **vite.config.embed.ts** - Builds the lightweight embed script (`src/embed.ts` → `dist/embed.js`)
   - Uses Vite's library mode with IIFE format
   - Injects a `<script src="...">` tag pointing to `main.js` into the target page's `<head>`
   - The URL for `main.js` is baked in at build time via `VITE_MAIN_JS_URL`:
     - `pnpm build` → GitHub Pages URL (`https://ano333333.github.io/ongeki-mypage-screenshot/main.js`)
     - `pnpm build:local` → Local preview URL (`http://localhost:4173/main.js`)

The builds run sequentially. `pnpm build` and `pnpm build:local` both start with `rm -rf dist` to clean the output directory.

## Development Commands

### Building

```bash
pnpm build              # Full build for production (embed.js points to GitHub Pages)
pnpm build:local        # Full build for local testing (embed.js points to localhost:4173)
pnpm build:html         # Build only the landing page
pnpm build:bookmarklet  # Build only the main bookmarklet script
pnpm build:embed        # Build only the embed script (uses NODE_ENV to select URL)
```

### Development

```bash
pnpm dev                # Start Vite dev server (for landing page only)
pnpm preview            # Serve production build at localhost:4173
```

### Local testing workflow

```bash
pnpm build:local        # Build with embed.js pointing to localhost:4173/main.js
pnpm preview            # Serve dist/ at localhost:4173
xdg-open dist/index.html  # Open landing page in browser
# Copy the bookmarklet, run it on ongeki-net.com — main.js loads from localhost:4173
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
- The bookmarklet code is `dist/embed.js` (URL-encoded), injected by the `inject-bookmarklet` plugin in `vite.config.ts`

### Embed script (embed.ts)

- Lightweight IIFE that injects a `<script>` tag into the target page's `<head>`
- The `src` URL is baked in at build time (`VITE_MAIN_JS_URL`)
- This is what users copy as the bookmarklet — kept as small as possible

### Bookmarklet (main.ts)

- Entry point for the actual screenshot functionality
- Must be written as an IIFE (Immediately Invoked Function Expression)
- Gets minified to a single line in `dist/main.js`
- Loaded dynamically by `embed.js` when the bookmarklet is clicked

## Important Constraints

1. **Build Order Matters**: `build:bookmarklet` → `build:embed` → `build:html` must run in this order. `build:html` reads `dist/embed.js` to inject into the landing page.

2. **Single File Output**: `main.js` MUST compile to exactly one file with all dependencies inlined, as it is loaded dynamically via script injection.

3. **emptyOutDir**: All three configs use `emptyOutDir: false`. The full `dist/` clean is done by `rm -rf dist` at the start of `pnpm build` and `pnpm build:local`.

4. **GitHub Pages Deployment**: The `dist/` directory contains the deployable artifacts for GitHub Pages.

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
