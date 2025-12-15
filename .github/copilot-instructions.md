# MTP-Update Codebase Guide for AI Agents

## Project Architecture Overview

**MTP** is a Vue 2-based fan community/merchandise platform with a Node.js/Express backend. It's a full-stack e-commerce and content site with internationalization (English/Vietnamese).

### Tech Stack

- **Frontend**: Vue 2 + Vue Router + Vuex, Bootstrap 4, jQuery, PIXI.js (WebGL animations)
- **Backend**: Express.js (Node.js), CORS-enabled, simple REST API
- **Build**: Vue CLI 5 with Webpack
- **Styling**: Component-scoped CSS (SCSS available), FontAwesome icons

### Directory Structure

```
backend/        → Express API server (port 3000)
frontend/src/
  ├─ components/    → Vue components (Layout, pages, UI elements)
  ├─ models/        → API client layer (authen, cart, checkout, products, user, pages)
  ├─ router/        → Vue Router (250+ lines, nested route structure)
  ├─ inc/           → Utilities (api.js, lang.js, utils.js, cursor.js, jquery.ripples.js)
  ├─ store.js       → Vuex store (minimal state: themeDark, userId, isApiLoading)
  └─ App.vue        → Root component (loading screen, custom cursor, page analytics)
```

## Critical Data Flows & Patterns

### API Communication

- **Single entry point**: `src/inc/api.js` wraps axios, hits `http://localhost:3000/api/`
- **Naming convention in backend**: Endpoints use plural (e.g., `/api/products`, `/api/products/:id`)
- **Response structure**: Backend returns `{status, data}` pattern
- **Loading state**: Global `window.startLoading()` / `window.stopLoading()` called by API layer
- **Example models** (`src/models/`): All expose async methods that call `api.call()`

```javascript
// Pattern: models/products.js
async getAll() { return await api.call('products'); }
async getById(id) { return await api.call('products/' + id); }
```

### Component Structure

- **Pages** live in `components/pages/` (Layout.vue is the main wrapper)
- **Route metadata** stores `meta: { title, themeDark, background, logo }` for dynamic styling
- **Pages are lazy-loaded** via router (see `router/index.js`)
- **Custom cursor**: SVG-based ripple effect managed in App.vue

### State Management (Vuex)

- **Minimal store** (`store.js`): Only 4 state properties
  - `themeDark`: Boolean for light/dark theme
  - `endLoading`: Bootstrap loading completed
  - `userId`: Logged-in user ID
  - `isApiLoading`: Track active API calls

### Internationalization (i18n)

- **Simple key-value lookup** in `src/inc/lang.js` (English → Vietnamese)
- **Usage**: `{{ ee('Add to cart') }}` in templates, `ee()` function imported from lang.js
- **Scope**: Months, days, UI labels, and e-commerce terms

### Routing & Theme System

- **Nested routes** under `Layout` component (main structure)
- **Route-based theming**: `meta.themeDark` on route controls light/dark CSS class
- **Special handling**: Artist page and Multimedia pre-render/load separately
- **Redirect logic**: Root `/` redirects to `/about-us`

## Development & Build Commands

### Frontend

```bash
cd frontend
npm install           # Install deps
npm run serve         # Dev server (hot reload) - runs on port 8080
npm run build         # Production build
npm run lint          # ESLint check
```

### Backend

```bash
cd backend
npm install
npm start             # Runs on port 3000
npm run dev           # Runs with nodemon for development
```

### Running Locally

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run serve`
3. Frontend dev server will proxy API calls to `http://localhost:3000/api/`

## Component-Specific Patterns

### Product Pages (`Shop.vue`, `Product.vue`)

- **Shop carousel**: Uses `vue-carousel` component, loads products from `models/products.js`
- **Product template fields**: `id`, `title`, `thumbnail`, `price`, `regular_price`, `content`, `redirect`
- **Redirect field**: If set, product links externally; null = internal route link

### Authentication Flow (`Login.vue`, `authen.js`)

- **Model methods**: `login(username, password)`, `get()` (fetch current user), `logout()`
- **Backend endpoints**: POST `/api/authen` (login), GET `/api/authen` (check session), DELETE (logout)
- **Session tracking**: `userId` in Vuex store indicates auth state

### Custom Video Component (`MTPEVideo.vue`)

- **Renders either**: HTML5 video (`isVid: true` on desktop) OR PIXI.js sprite animation (mobile/forced)
- **Props**: `src`, `animation` (frame template), `animationCount`, `forceAnimation`, `cursorEffect`
- **Usage**: Loading screen in `App.vue` (frame sequence animation)

### Background Component (`Background.vue`)

- **Visibility**: Controlled by route metadata and loading state
- **Used on**: Most pages except `/menu`
- **Render condition**: `v-show="defaultBackground || !$store.state.endLoading"`

## Code Style & Conventions

### Vue Component Structure

```vue
<template><!-- Single root div with class matching component name --></template>
<script>
export default {
  components: {
    /* nested components */
  },
  data() {
    return {
      /* reactive state */
    };
  },
  computed: {
    /* derived state */
  },
  watch: {
    /* route/prop changes */
  },
  mounted() {
    /* init, DOM manipulation */
  },
  methods: {
    /* event handlers */
  },
};
</script>
<style scoped>
/* BEM-like class naming */
</style>
```

### Styling

- **Scoped CSS** per component (no global CSS conflicts)
- **Bootstrap utility classes** used (ta-c = text-align-center, va-m = vertical-align-middle, etc.)
- **Custom class prefix**: `c-` for color, `fs-` for font-size, `mb-`, `mt-` for margin
- **Mobile breakpoint**: `@media (max-width: 800px)` (not 768px!)
- **Responsive strategy**: Desktop-first, hide elements on mobile with `@media`

### JavaScript Conventions

- **No semicolons** in some files (style choice)
- **CommonJS on backend** (`require`), **ES6 modules on frontend** (`import`)
- **jQuery usage**: Still present for DOM manipulation (`.find()`, `.css()`, `.hover()`)
- **Async/await** preferred over `.then()` chains

### ESLint Config Notes

- **Disabled rules** (see `package.json`): `no-unused-vars`, `no-redeclare`, `vue/multi-word-component-names`
- **These allow**: Single-word components, unused variables in templates, code patterns
- **Don't add strict linting** without updating config

## Integration Points & External Dependencies

### npm Packages Worth Knowing

- **vue-carousel**: Used in Shop.vue for product carousel
- **axios**: HTTP client (wrapped in `api.js`)
- **gsap**: Animation library (imported but verify usage)
- **pixi.js**: WebGL rendering (MTPEVideo.vue for animations)
- **bootstrap/jquery/fontawesome**: UI framework & icons

### Backend Data Format (Mock in index.js)

```javascript
{
  id: 1,
  title: "Product Name",           // NOT 'name'
  thumbnail: "image-url",          // NOT 'image'
  price: 500000,                   // Current price
  regular_price: 600000,           // Original price
  content: "<html>description</html>",
  redirect: null                   // External link or null
}
```

### Known Quirks

- **Backend cors()**: Enabled globally (no credential restrictions currently)
- **Loading screen**: Plays video OR sprite animation (mobile); blocks UI until done
- **Global functions**: `window.startLoading()` and `window.stopLoading()` called by API layer
- **Google Analytics**: gtag integration on route change in App.vue

## Testing & Debugging

### Common Workflows

1. **Check API communication**: Browser DevTools → Network tab, verify requests to `localhost:3000/api/`
2. **Check store state**: Browser devtools Vue plugin → Vuex tab
3. **Component inspection**: Vue DevTools browser extension
4. **Mobile viewport testing**: Built-in mobile emulation; remember 800px breakpoint

### Build Output

- **Frontend build folder**: `frontend/dist/` (created by `npm run build`)
- **Bundles**: Webpack splits into app.js, vendor.js, manifest.js (see public/static/js/)
- **Static assets**: `public/static/` (images, fonts, loading sprites)

## Quick Reference: File Locations

| Task                     | File                                                  |
| ------------------------ | ----------------------------------------------------- |
| Add new route            | `src/router/index.js`                                 |
| Add new page             | `src/components/pages/NewPage.vue` + import in router |
| Add API endpoint         | `backend/index.js` + create model in `src/models/`    |
| Add translation          | `src/inc/lang.js` (TABLE object)                      |
| Modify theme             | `src/store.js` state or route `meta.themeDark`        |
| Customize cursor         | `src/inc/cursor.js` or App.vue SVG filter             |
| Global utility functions | `src/inc/utils.js`                                    |
