# Next Steps Radio App

A lightweight React and Vite web app for the Next Steps Radio Podcast Network.

## Purpose

This repository is the web foundation for the Next Steps Radio Podcast Network app. The current version focuses on a clean live-stream experience, basic show information, host information, and contact options.

## Current Features

- Live audio stream player
- Show schedule and station listing
- Verse of the day section
- Host bio section
- Contact links
- Support mission placeholder
- Responsive layout for desktop and mobile screens
- Basic Progressive Web App metadata

## Tech Stack

- React 18
- Vite 5
- JavaScript
- CSS

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## PWA Foundation

The app includes a basic web app manifest and mobile metadata so browsers and mobile devices can recognize it as an installable app foundation.

Current PWA files:

- `public/manifest.webmanifest`
- `public/icons/icon.svg`
- PWA metadata in `index.html`

Future PWA improvements should include production-ready PNG icons, offline support, a service worker, and install testing on iOS and Android.

## Repository Standards

- Keep `main` stable.
- Use feature branches for meaningful changes.
- Do not commit `node_modules`, build output, local environment files, or editor-specific settings.
- Keep show copy, station information, stream URLs, and contact details easy to update.
- Prefer clear file names and simple structure over clever complexity.

## Suggested Roadmap

1. Add real now-playing metadata from the stream provider.
2. Add podcast episode archive links.
3. Add sponsor and guest pages.
4. Add a working support or donation link.
5. Add production-ready PWA install support.
6. Prepare the codebase for iOS and Android wrappers.
7. Add analytics after the privacy approach is decided.

## Deployment Notes

This app can be deployed to any static hosting platform that supports Vite builds, including GitHub Pages, Netlify, Vercel, Cloudflare Pages, or similar services.

The basic build command is:

```bash
npm run build
```

The production output folder is:

```bash
dist
```
