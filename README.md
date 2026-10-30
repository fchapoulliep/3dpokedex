# 3D Pokédex

A React + TypeScript application that lets you browse the first generation of Pokémon in an interactive 3D Pokédex.

The app includes a searchable Pokémon list, type-based filtering, animated 3D models, sound playback, and a card-based browsing experience inspired by classic Pokédex interfaces.

## Features

- 3D Pokémon viewer using React Three Fiber and Three.js
- Search by Pokémon name
- Filter by Pokémon type
- Horizontal carousel browsing for the Pokédex entries
- Pokémon detail page with description, types, and model rendering
- Audio playback for each Pokémon
- GitHub Pages deployment setup
- Responsive UI with React Router navigation

## Tech Stack

- React 18
- TypeScript
- Vite
- React Three Fiber
- Drei
- Three.js
- Swiper
- React Router
- gh-pages

## Getting Started

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

The app will be available in the browser through the Vite local dev server.

### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## Live Demo

The project is configured for GitHub Pages deployment:

https://fchapoulliep.github.io/3dpokedex/

## Notes

- The Pokémon data is stored in `src/data/pokemons.json`.
- 3D models and related assets are served from the `public/models` folder.
- Pokémon live at real paths (`/3dpokedex/25`). GitHub Pages has no fallback for a single-page app, so the build (a small plugin in `vite.config.ts`) writes one HTML file per Pokémon, with its own title, description, share image and canonical URL, plus a `404.html` that loads the app on any other path and a `sitemap.xml` generated from the data. Old `#/25` links are redirected.

## License

This project is for educational and personal use.