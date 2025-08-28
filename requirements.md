---
description: Next.js with TypeScript, Genkit, and Tailwind UI best practices for Style Ascent project.
globs: **/*.tsx, **/*.ts, src/**/*.ts, src/**/*.tsx
---
# Next.js + TypeScript Coding Standards for Style Ascent

## TypeScript Best Practices
- Always use strict TypeScript typing; never use `any` unless absolutely necessary.
- Use proper interface/type definitions for all props, API responses, and function parameters.
- Prefer `type` for component props and `interface` for data structures/models.
- Use proper generic types for reusable components.
- Import types with `import type` when only importing for typing.
- Never use eslint-disable comments unless explicitly requested and justified.

## Project Structure
- Use the App Router directory structure.
- Place route-specific pages and layouts in the `app` directory.
- Place shared React components in the `components` directory.
- Place utilities, helpers, and static data (like `outfits.ts`, `constants.ts`) in the `lib` directory.
- Use lowercase with dashes for new directories (e.g., `components/user-profile`).
- Keep UI logic within `components/`.
- Place AI-related business logic (flows, prompts) in `src/ai/flows/`.
- Use `src/app/actions.ts` for server-side actions called from client components.
- Use `hooks/` for custom React hooks.

## Components
- Default to Server Components for performance.
- Mark client components explicitly with `'use client'` at the top of the file.
- Use dynamic loading for large, non-critical components to improve initial load time.
- Implement proper error boundaries using `error.tsx` files for route segments.
- Prefer using ShadCN UI components from `components/ui` where applicable.
- Ensure all components are responsive and accessible.

## Next.js App Router Patterns
- Default to Server Components unless client interactivity is specifically needed.
- Only use `'use client'` when you need:
  - Browser APIs (localStorage, window, document).
  - Event handlers (onClick, onChange, etc.).
  - React hooks that depend on state or lifecycle (`useState`, `useEffect`, etc.).
  - Third-party libraries that require client-side execution.
- For server data fetching, use `async` components and direct data fetching within them.
- For client-side mutations, use Server Actions defined in `src/app/actions.ts`.
- Use the Next.js Metadata API for page-specific metadata (`<title>`, `<meta>`).
- Each route segment should ideally include a `loading.tsx` file for better UX during navigation.

## Performance
- Optimize images using the built-in `next/image` component. Use placeholder images from `picsum.photos` during development.
- Minimize the use and scope of `'use client'` components to reduce the client-side JavaScript bundle.
- Favor Server Components (RSC) to move rendering and data fetching to the server.
- Use dynamic loading (`next/dynamic`) for components that are not visible on the initial page load.
- Implement proper caching and revalidation strategies for fetched data when applicable.

## Forms and Validation
- Use `react-hook-form` for form state management.
- Use `zod` for schema definition and validation, integrated with `react-hook-form` via `@hookform/resolvers/zod`.
- Implement both client-side and server-side validation for security and data integrity.
- Clearly display loading states during form submission and provide user feedback (e.g., Toasts) for success or error cases.
- Use Server Actions for handling form submissions.

## State Management
- Minimize client-side state. Prefer deriving state from URL search params (`useSearchParams`) for filterable views.
- Use React Context (`createContext`) for global state that is accessed by many components at different levels (e.g., `SettingsContext`).
- Prefer server-managed state (fetched via Server Components or Server Actions) over client-side state wherever possible.
- Always provide explicit loading states (e.g., Skeletons) for asynchronous data fetching to avoid layout shifts and improve perceived performance.

## Generative AI (Genkit)
- All AI-related functionality must be implemented using `genkit`.
- Define AI flows in the `src/ai/flows/` directory, with one flow per file.
- Export the flow wrapper function, input type, and output type from each flow file.
- Use Zod (`z`) to define strict schemas for flow inputs and outputs. This is crucial for structured data generation.
- The prompt string within `ai.definePrompt` must use Handlebars syntax (`{{{}}}`).
- Ensure all Genkit flows have the `'use server';` directive at the top of the file.
- Do not rewrite the Genkit initialization code in `src/ai/genkit.ts`.
