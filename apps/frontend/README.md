# Santan Frontend

A modern blog application focused on pension and financial topics, built with TanStack Start and Sanity CMS.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) with React 19
- **CMS**: [Sanity](https://www.sanity.io/) for content management
- **Routing**: [TanStack Router](https://tanstack.com/router) with SSR support
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) with SSR integration
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4 & [Vanilla Extract](https://vanilla-extract.style/)
- **Build Tool**: [Vite](https://vitejs.dev/) with Nitro v2 for deployment
- **Type Safety**: TypeScript with Zod validation
- **Testing**: [Vitest](https://vitest.dev/) with Testing Library
- **Code Quality**: ESLint, Prettier, and Commitlint

## Features

- 📝 Blog posts with rich content editing via Sanity Portable Text
- 🏷️ Category organization
- 🖼️ Optimized image handling with Sanity Image URLs
- 🔍 SEO-friendly with proper meta tags and head management
- 🎨 Modern styling with Tailwind CSS v4 and Vanilla Extract
- ⚡ Server-Side Rendering (SSR) with TanStack Start
- 🔄 Live preview mode with Sanity Visual Editing
- ♾️ Infinite scroll for blog posts
- 🎯 Type-safe API integration with generated Sanity types
- 🔒 Secure preview mode with iron-session

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- A Sanity project (see [Sanity.io](https://www.sanity.io/))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd santan
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Sanity project credentials:
```env
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01
SANITY_READ_TOKEN=your-read-token
SANITY_SESSION_SECRET=your-session-secret
SANITY_STUDIO_URL=http://localhost:3333
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Building for Production

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

Preview the production build:
```bash
npm run serve
```

## Project Structure

```
src/
├── components/        # React components
│   ├── GlobalLayout/  # Layout wrapper
│   ├── Header/        # Site header
│   ├── PortableText/  # Sanity Portable Text renderer
│   ├── PostCard/      # Blog post preview card
│   └── ...
├── pages/            # Page components
│   ├── Home/         # Homepage with post listing
│   ├── Post/         # Individual post page
│   ├── Category/     # Category listing page
│   └── ...
├── routes/           # TanStack Router routes
├── sanity/           # Sanity integration
│   ├── queries/      # GROQ queries
│   ├── client.ts     # Sanity client configuration
│   └── ...
├── loaders/          # Route data loaders
├── types/            # TypeScript type definitions
└── contexts/         # React contexts

```

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run serve` - Preview production build
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run check:types` - Type check with TypeScript
- `npm run check:lint` - Lint and fix issues
- `npm run check` - Run type checking and linting
- `npm run apply:format` - Format code with Prettier
- `npm run clean` - Remove build output

### Preview Mode Scripts

- `npm run setup:preview-secret` - Set up preview mode secret
- `npm run get:preview-secret` - Get current preview secret
- `npm run cleanup:preview-secrets` - Clean up old preview secrets
- `npm run publish:preview-secret` - Publish preview secret to Sanity

## Key Integrations

### Sanity CMS

The project integrates with Sanity for content management:
- Content is fetched using GROQ queries
- Supports draft/preview mode with live updates
- Visual editing enabled via `@sanity/visual-editing`
- Optimized image delivery with Sanity Image URLs

### TanStack Router & Query

- File-based routing with type-safe route definitions
- SSR-enabled data loading with loaders
- Integrated with TanStack Query for efficient data fetching
- Automatic route generation via `routeTree.gen.ts`

### State Management

The application uses a combination of approaches for state management:

- **TanStack Query**: Handles server state, data fetching, and caching
- **TanStack Store**: Used for client-side state like preview mode (see `previewStore.ts`)

#### Using TanStack Store

The preview mode state is managed using TanStack Store. Here's how it works:

```tsx
import { useStore } from '@tanstack/react-store';
import { previewStore, setPreviewMode } from '@/stores/previewStore';

function MyComponent() {
  const { isPreview } = useStore(previewStore);
  
  // Update the preview state
  const togglePreview = () => {
    setPreviewMode(!isPreview);
  };
  
  return <div>Preview mode: {isPreview ? 'ON' : 'OFF'}</div>;
}
```

To create additional stores for your own state:

```tsx
import { Store } from '@tanstack/store';

// Create a store
const counterStore = new Store({ count: 0 });

// Use in a component
function Counter() {
  const { count } = useStore(counterStore);
  
  return (
    <button onClick={() => counterStore.setState((state) => ({ count: state.count + 1 }))}>
      Count: {count}
    </button>
  );
}
```

For derived state:

```tsx
import { Store, Derived } from '@tanstack/store';

const countStore = new Store({ count: 0 });

const doubledStore = new Derived({
  fn: () => countStore.state.count * 2,
  deps: [countStore],
});
doubledStore.mount();
```

Learn more in the [TanStack Store documentation](https://tanstack.com/store/latest).

### Styling

Two styling approaches are used:
- **Tailwind CSS v4**: Utility-first CSS framework
- **Vanilla Extract**: Type-safe CSS-in-TypeScript for component styles

## Environment Variables

Required environment variables (see `.env.example`):

| Variable | Description |
|----------|-------------|
| `SANITY_PROJECT_ID` | Your Sanity project ID |
| `SANITY_DATASET` | Dataset name (usually `production`) |
| `SANITY_API_VERSION` | API version (e.g., `2024-01-01`) |
| `SANITY_READ_TOKEN` | Read token for draft content (optional) |
| `SANITY_SESSION_SECRET` | Secret for preview sessions (optional) |
| `SANITY_STUDIO_URL` | URL to your Sanity Studio (optional) |

## Deployment

The project uses Nitro v2 with Node.js server preset for deployment. The build output is in `.output/server/index.mjs`.

To deploy:
1. Build the project: `npm run build`
2. Deploy the `.output` directory to your hosting provider
3. Set environment variables on your hosting platform
4. Run: `node .output/server/index.mjs`

## License

Private project.

## Learn More

- [TanStack Start Documentation](https://tanstack.com/start)
- [TanStack Router Documentation](https://tanstack.com/router)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vanilla Extract Documentation](https://vanilla-extract.style/)
