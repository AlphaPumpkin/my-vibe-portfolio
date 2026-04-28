# My Vibe Portfolio

## Tech Stack
- React 18 + Vite 6 + Tailwind CSS 3 + PostCSS
- framer-motion 11 (animations)
- lucide-react 0.468 (icons)
- canvas-confetti 1.9 (particle effects)
- Deployed on Vercel (`my-vibe-portfolio-ten.vercel.app`)

## Project Structure
```
src/
  App.jsx              — root layout: gradient background, dividers, section order
  index.css            — global styles: dark body bg, .bento, .text-accent, fonts
  components/
    Hero.jsx           — magnetic avatar, typewriter subtitle, interest tags
    Gallery.jsx        — poster + architecture design gallery with lightbox
    ThreeDSpace.jsx    — 3D architecture renders + game scene videos + lightbox
    VirtualHost.jsx    — 小红书 brand incubation: stats, phone panels, CTA
    SkillsPlayground.jsx — tech tool stack: microgravity badges (Maya, UE5, etc.)
    Contact.jsx        — email reveal + confetti, social links
    ReviewGenerator.jsx — phone mockup AI review generator with slider
```

## Design System: Dark Glass Ethereal Theme
- **Background**: `#090b0f` (body), `#0f1117` (phone screens), `#1a1d25` (bezels)
- **Glass cards**: `.bento` class = `bg-white/[0.03] border border-white/[0.08]` with `rounded-2xl`
- **Text**: headings `text-gray-100 font-serif`, body `text-gray-400`, labels `text-gray-500`
- **Accent**: teal/cyan/purple gradient via `.text-accent` class
  - `#2dd4bf` (teal-400), `#22d3ee` (cyan-400), `#a78bfa` (purple-400)
- **Font**: body = Inter/Noto Sans SC, headings = Noto Serif SC (loaded via @import in CSS)
- **Borders**: `border-white/[0.06]` (subtle), `border-white/[0.08]` (standard)

## Tailwind Custom Classes (in index.css)
- `.bento` — dark glass card: transparent bg, subtle white border, rounded-2xl
- `.text-accent` — teal→cyan→purple gradient text clip
- `::selection` — teal highlight

## Key Conventions
- All image/video paths use `import.meta.env.BASE_URL` (currently `/`)
- Image URLs use `encodeURI()` because filenames may contain spaces
- Lightbox navigation: prev/next buttons within same category only
- Cards use `whileHover={{ y: -10 }}` for lift effect — works in flex/grid but NOT CSS columns
- **DO NOT use CSS `columns` layout** — it clips framer-motion transforms and shadows
- Responsive grids use `flex flex-wrap gap-*` with `calc()` widths instead

## Deploy
- `npm run build` → `dist/`
- Vercel CLI: `npx vercel deploy --prod --yes --scope xunans-projects-707a1842`
- GitHub Actions: `.github/workflows/deploy.yml` (push to main triggers Pages deploy)

## Current State
- All 7 components + global files have the dark glass theme applied
- Gallery: dual-column layout (architecture left ~70%, posters right ~30%)
- ThreeDSpace: split layout (2 images left 35%, 4 images right 60%) + 2 full-width videos
- Lightboxes: image `max-h-[75vh] object-contain`, container `max-w-[95vw]`, no zoom toggle
- VirtualHost: working confetti on GMV stat click, floating hearts on heart stat click
- Contact: email auto-copied to clipboard with confetti celebration

## Potential Next Steps (as of April 2026)
- Replace placeholder social links (GitHub/Twitter/Email href="#") with real URLs
- Add more projects to Gallery or ThreeDSpace
- Configure custom domain
- Optimize video file sizes for mobile loading
