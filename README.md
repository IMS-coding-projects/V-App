# V-App

Source code of V-App.

## Tech Stack

The stack consists of:

- React Native
- Expo (Expo Go during development)
- Metro
- React Native Reusables
- Uniwind
- Lucide

### Details

- React Native: Cross‑platform mobile app framework providing core components and native APIs.
- Expo: Framework and tooling for React Native that simplifies app development; Expo Go is used for running the app in development.
- Metro: JavaScript bundler and development server used by React Native and Expo to bundle and serve the app code. ("Vite" for React Native; i.e. Metro has the same role like Vite in other web apps)
- React Native Reusables: UI component library for React Native, inspired by shadcn/ui.
- Uniwind: Tailwind-style CSS for React Native, used by React Native Reusables.
- Lucide: Icon library used by React Native Reusables for icons.

## Folder Structure

```markdown
.
├── app/ # Expo Router file-based routing
│ ├── +html.tsx # Custom HTML document (web platform)
│ ├── +not-found.tsx # 404 page for unmatched routes
│ └── index.tsx # Home screen (`/`)
├── app.json # Expo app configuration
├── assets/
│ └── images/ # Static image assets
├── babel.config.js # Babel transpiler configuration
├── components/
│ └── ui/ # React Native Reusables UI components
├── components.json # React Native Reusables CLI config
├── global.css # CSS custom properties (Tailwind vars)
├── lib/ # Shared utilities and theme
│ ├── theme.ts # JS/TS theme object (mirrors global.css)
│ └── utils.ts # App utilities (cn, cnid, etc.)
├── metro.config.js # Metro bundler configuration
├── package-lock.json # Dependency lockfile (npm)
├── package.json # Dependencies and scripts
├── tsconfig.json # TypeScript configuration
└── uniwind-types.d.ts # Uniwind Tailwind type declarations
```

## Key directories explained

**`app/`** - Expo Router routes (file = route):

- `index.tsx` → `/` (home)
- `[slug].tsx` → `/slug` (dynamic)
- `_layout.tsx` → Shared layout

**`lib/`** - App-wide shared code (theme, utils, hooks)

**`components/ui/`** - Copy-pasted React Native Reusables components

**Root configs** drive Babel, Metro, TypeScript, and Expo behavior. (Ask AI if you want to understand a specific one)
