# Brooklyn Memory Map

A Google-Maps-style interactive map for pinning childhood memories from Brooklyn, NY. Click anywhere on the map to drop a pin, give it a title, a date, and a short story — your memories live right where they happened.

Built for Angel Smythe (Multica SORA-14) as a personal, evolving map of his Brooklyn childhood.

## Features

- 🗺️ Real interactive map centered on Brooklyn, using [Leaflet](https://leafletjs.com/) + free [OpenStreetMap](https://www.openstreetmap.org/) tiles (no API key required, no billing risk)
- 📍 Click "Add memory" then click any spot on the map to drop a pin
- ✏️ Each pin has a title, a "when" (year/date), and a short story
- 🧭 Each pin popup has a "Street View" toggle that embeds Google Street View at that exact spot, plus an "Open in Google Street View" link that opens full Street View in a new tab
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

## Street View (optional)

The "Open in Google Street View ↗" link in every pin popup works with no setup — it opens Google Maps Street View in a new tab at the pin's exact coordinates.

For the embedded in-page Street View panel (toggled via the "🧭 Street View" button), you need a Google Maps **Embed API** key:

1. Create/select a project in the [Google Cloud Console](https://console.cloud.google.com/), enable the **Maps Embed API**, and create an API key.
2. Restrict the key to the Maps Embed API and to your site's domain (and `localhost` for dev).
3. Create a `.env` file (not committed) with:
   ```
   VITE_GOOGLE_MAPS_EMBED_KEY=your_key_here
   ```
4. On Netlify, add `VITE_GOOGLE_MAPS_EMBED_KEY` under Site settings → Environment variables, then redeploy.

Without the key set, the embedded panel button is hidden and only the "Open in Google Street View" link is shown — the app still works fully.

## Build

```bash
npm run build
```

Outputs a static site to `dist/`, deployable anywhere (Netlify, Vercel, GitHub Pages, etc.).

## Data note

Pin data lives only in your browser's localStorage under the key `memory-map-pins`. Clearing browser data / site data will remove it — use "Export JSON" periodically to keep a backup.
