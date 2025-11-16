# Chris Chinchilla - Personal Website

The personal website of Chris Chinchilla.

🌐 **Live Site:** [https://chrischinchilla.com](https://chrischinchilla.com)

## About This Site

Shows my work across multiple creative and technical domains:

- **Blog Posts** - Technical articles, tutorials, and opinion pieces
- **Podcasts** - Audio content on technology and creative topics
- **Books** - Published works and writing projects
- **Games** - Interactive fiction and game development projects
- **Events** - Speaking engagements, conferences, and workshops
- **Client Work** - Portfolio of professional projects

## Tech Stack

Built with [Astro](https://astro.build) and deployed on Netlify.

## Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images and media files
│   ├── components/     # Reusable Astro/React components
│   ├── content/        # Content collections (blog, podcasts, books, etc.)
│   ├── layouts/        # Page layouts
│   ├── pages/          # Route pages
│   ├── utils/          # Utility functions
│   └── config.mjs      # Site configuration
├── astro.config.ts     # Astro configuration
└── package.json        # Dependencies and scripts
```

## Development

### Prerequisites

- Node.js (see package.json for version requirements)
- npm

### Commands

All commands are run from the root of the project:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Install dependencies                             |
| `npm run dev`          | Start local dev server at `localhost:4321`       |
| `npm run build`        | Build production site to `./dist/`               |
| `npm run buildv`       | Build with verbose output                        |
| `npm run preview`      | Preview build locally before deploying           |
| `npm run format`       | Format code with Prettier                        |
| `npm run lint:eslint`  | Lint code with ESLint                            |

### Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:4321`

## Content Management

Content is organized into collections located in `src/content/`:

- `blog/` - Blog posts
- `podcast/` - Podcast episodes
- `book/` - Books and publications
- `game/` - Game projects
- `event/` - Speaking events and conferences
- `client/` - Client work and portfolio items

Each content type uses frontmatter for metadata and can be written in Markdown or MDX.

## Configuration

Site configuration is managed in `src/config.mjs`, including:

- Site metadata (title, description, origin)
- Content collection settings (pagination, permalinks)
- Feature toggles for different content types

## Deployment

The site is automatically deployed to Netlify when changes are pushed to the main branch.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
