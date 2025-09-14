# AI Code Generation Rules - Sanity.io Next.js

## General Practices
- Use **TypeScript** for all code.
- Follow **Turbopack** for optimizing the build with `next dev --turbopack`.
- Ensure compatibility with **Node.js >= 20**.

## Styling
- Use **Tailwind CSS** for styling.
- Maintain consistent theme settings across **styled-components** and Tailwind.

## Directory Structure
- Keep components under `src/components`.
- Use `src/lib/sanity` for all Sanity.io integrations.

## Frameworks
- Use **Next.js** for all web applications.
- Use **Sanity.io** for content management.

## Coding Standards
- Utilize **ESLint** with custom workspace configuration.
- Format code with **Prettier** using project standards.

## Dependencies
- Ensure `exact versions` for dependencies in `package.json`.
- Use **Lucide-react** for icons consistently in the UI.

## Security
- Manage secrets and tokens using environment variables and Sanity.io's secure storage.
- Enable **server-side rendering** as default but use **client components** only when necessary.

## Testing
- Write tests for new components and utilities using **Jest** and **React Testing Library**.
- Check types with **TypeScript's strict mode**.

## Deployment
- Use `sanity build` and `sanity deploy` for deploying the studio.
- Configure Next.js `images` to optimize cache and work with Sanity CDN.

## Documentation
- Document components and modules using JSDoc.
- Maintain up-to-date README files for `studio` and `web` apps.

## Miscellaneous
- Use **Zod** for validating schemas.
- Separate business logic using **custom hooks** under `src/hooks`.
