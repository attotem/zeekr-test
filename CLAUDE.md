# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run preview   # Preview production build locally
```

No test runner is configured. No linter config is present.

## Architecture Overview

**Zeekr Landing** is a Vue 3 + Vite SPA (no TypeScript) for the Zeekr EV brand's Ukrainian website. The core pattern is a **JSON-driven page system**: each car model's page layout and content is defined entirely in a JSON file under `src/assets/pages/`, and a single universal view (`src/views/Test7x.vue`) renders any car page by mapping JSON block types to Vue components.

### JSON → Page Rendering

Each car page JSON (e.g. `8x.json`, `zeekr8x_shadow.json`) has this structure:
```json
{
  "layout": [
    { "type": "hero", "dataKey": "hero" },
    { "type": "textBlock", "dataKey": "textBlockDesign" },
    ...
  ],
  "hero": { "title": { "ua": "...", "en": "..." }, ... },
  "textBlockDesign": { ... }
}
```

`Test7x.vue` loads the JSON with `import.meta.glob('@/assets/pages/*.json')`, maps each `type` to a component via `componentMap`, and renders `<component :is="..." :data="..." />` for each layout entry. The `dataKey` field points to the top-level key in the same JSON where that block's data lives.

Block components live in `src/components/new_car_page/`. Full documentation of all block types and their data schemas is in `src/components/new_car_page/BLOCKS.md`.

### Routes → Car Pages

Car model routes (e.g. `/zeekr-8x-shadow`) are defined in `src/router/index.js` with `meta.carId`. `Test7x.vue` reads `meta.carId` to determine which JSON file to load and which subfolder of `src/assets/pages/` to resolve media from.

### Localization — Two Separate Systems

There are **two distinct i18n mechanisms**:

1. **Car page JSON data** — uses `ua`/`en` keys directly in the data objects:
   ```json
   { "ua": "Текст", "en": "Text" }
   ```
   Active language comes from `useLangStore()` (Pinia). The store key is `en` or `uk` — but JSON data files use `ua` (not `uk`) for Ukrainian. Components handle this discrepancy internally.

2. **Global UI strings** — served from `/public/i18n.json`, loaded at app startup in `src/main.js`, and attached to `app.config.globalProperties.i18n`. Used for navigation, buttons, modals, etc. Uses `en`/`uk` keys.

Language state is persisted in `sessionStorage` via `src/stores/lang.js`.

### Media Path Resolution

In **dev**, media files are served from `/src/assets/pages/${carId}/filename`.  
In **production**, the Vite plugin `copyPagesPlugin()` (in `vite.config.js`) copies `src/assets/pages/` to `dist/pages/`, so paths become `/pages/${carId}/filename`.

`src/utils/resolveMedia.js` handles this resolution automatically — always use it rather than constructing paths manually.

### API Integration

`src/composables/API.js` is the sole HTTP client. Base URL is `https://zeekr-back.xyz/api`, proxied through `/media` in dev via `vite.config.js`. All requests include the active `lang_code` from `useLangStore()`. The optional env var `VITE_API_ORIGIN` overrides the backend URL.

### State Management (Pinia)

- `src/stores/lang.js` — active language (`en`/`uk`), persisted to `sessionStorage`
- `src/stores/loader.js` — global loading state shown as overlay

### Adding or Editing a Car Page

1. Edit the relevant JSON in `src/assets/pages/` (e.g. `zeekr8x_shadow.json`)
2. Add media assets to the matching subfolder (e.g. `src/assets/pages/zeekr8x_shadow/`)
3. To add a new block type: create a component in `src/components/new_car_page/`, register it in the `componentMap` in `Test7x.vue`, and document it in `BLOCKS.md`
