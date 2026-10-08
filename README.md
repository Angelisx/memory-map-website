# Brooklyn Memory Map

A Google-Maps-style interactive map for pinning childhood memories from Brooklyn, NY. Click anywhere on the map to drop a pin, give it a title, a date, and a short story — your memories live right where they happened.

Built for Angel Smythe (Multica SORA-14) as a personal, evolving map of his Brooklyn childhood.

## Features

- 🗺️ Real interactive map centered on Brooklyn, using [Leaflet](https://leafletjs.com/) + free [OpenStreetMap](https://www.openstreetmap.org/) tiles (no API key required, no billing risk)
- 📍 Click "Add memory" then click any spot on the map to drop a pin
- ✏️ Each pin has a title, a "when" (year/date), and a short story
- 💾 Pins are saved to the browser's `localStorage` — they persist across reloads on the same device/browser
- ⬇️ "Export JSON" button to back up all pins as a JSON file at any time
- 🗑️ Delete a pin from its popup

## Why localStorage (not a database)?

This is a single-user personal memory journal. localStorage means zero backend, zero auth, zero security surface, and it works immediately after deploy — Angel can drop his first real pin the moment the site loads. The Export button gives an easy way to back up or migrate the data later (e.g. to a database) if the project grows.

## Tech stack

- [Vite](https://vite.dev/) + [React](https://react.dev/)
- [react-leaflet](https://react-leaflet.js.org/) / [Leaflet](https://leafletjs.com/)
- OpenStreetMap tile layer (free, no API key)
- Deployed on [Netlify](https://www.netlify.com/)

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Outputs a static site to `dist/`, deployable anywhere (Netlify, Vercel, GitHub Pages, etc.).

## Data note

Pin data lives only in your browser's localStorage under the key `memory-map-pins`. Clearing browser data / site data will remove it — use "Export JSON" periodically to keep a backup.
