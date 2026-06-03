# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Static export to out/ directory
npm run lint     # ESLint via Next.js
```

No test suite exists. There is no `npm test` script.

## Architecture

**Next.js 14 static export** — `output: 'export'` in `next.config.js` generates a fully static `out/` folder. There is no server runtime. `next start` only previews the static output locally. All pages must be compatible with static generation (no server-side data fetching, no API routes).

**All pages are `'use client'`** — every page in `src/app/` uses client-side rendering. Animations, scroll effects, and interactive state are driven by `IntersectionObserver`, `requestAnimationFrame`, and React hooks directly in each page file. There is no shared state management library.

**Page-local utilities** — `useInView`, `AnimatedCounter`, `Reveal`, and `ScrollProgress` are defined inline inside `src/app/page.js` and duplicated across pages as needed. They are not extracted to a shared module.

**Layout shell** — `src/app/layout.js` wraps all pages with `Navbar`, `Footer`, and `WhatsappButtonConditional`. Font loading (5 Google Fonts) is handled here via `next/font/google` and exposed as CSS variables (`--font-montserrat`, `--font-dm-sans`, `--font-cormorant`, `--font-open-sans`, `--font-jetbrains`).

**WhatsApp float behavior** — `WhatsappButtonConditional` delays showing the button on the home page (`/`) until a custom `introTerminada` DOM event fires (dispatched by the hero intro sequence in `page.js`). On all other pages it shows immediately. It also hides when the mobile menu is open, detected via `MutationObserver` watching `document.body.classList` for `mobile-menu-open`.

**CSS split** — global utility classes (`.btn-primary`, `.service-card`, `.route-card`, `.stat-number`, etc.) live in `src/app/globals.css`. Component-specific animations are injected as `<style>` tags inside component files using template literals (e.g., `NAVBAR_CSS` constant in `Navbar.js`).

**Static documents** — PDF documents for transparency (ESAL) and policies are stored directly in `public/documentos-2022/`, `public/esal2023/`, `public/documentos_essa_2024/`, and `public/Politicas/`. The `Documentos` and `politicas` pages hardcode the document lists as JS arrays — adding a new document requires updating both the `public/` folder and the array in the corresponding page file.

**Tailwind config** — `tailwind.config.js` extends colors with `primary` (blue scale) and `accent` (amber/orange scale), and sets `heading`/`body` font families. CSS custom properties in `globals.css` (`--primary`, `--accent`, etc.) duplicate some of these values for use in non-Tailwind CSS rules.

**Image optimization disabled** — `images: { unoptimized: true }` is required for static export. All images in `public/` are `.webp`; use `.webp` for any new image assets.

**Path alias** — `@/` maps to `src/` (configured in `jsconfig.json`).
