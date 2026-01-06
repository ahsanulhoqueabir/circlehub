# Code Implementation Instructions

- If anything needs to be added to Supabase, add it using the Supabase MCP server.
- Use TypeScript for all new code.
- Use `use-axios` hook for all private API calls that require authentication.
- use `with-auth` middleware for all API routes that require authentication.
- Naming Conventions:

  - file name -> kebab-case
  - class name -> PascalCase
  - function name -> camelCase
  - constant name -> UPPER_SNAKE_CASE
  - variable name -> underscore_case
  - types and interfaces -> PascalCase

- File Structure:
  - Place all type definitions in the `types` directory.
  - Place all service classes in the `services` directory.
  - Place all API route handlers in the `app/api` directory.
  - Place all React components in the `components` directory in sub directories for each feature or domain.
  - Place all utility functions in the `utils` directory.
- after implementing new features, update the relevant documentation files in the `docs` directory. and ensure to include any new API endpoints, data structures, or configuration steps.
- in `docs` directory maintain sub directories for different categories of documentation such as `API`, `Setup`, `Guides`, `features` and `References`.
