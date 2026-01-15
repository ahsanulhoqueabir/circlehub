# Code Implementation Instructions

## Core Technologies

- Use MongoDB with Mongoose for database operations.
- Use TypeScript for all new code.
- Use `use-axios` hook for all private API calls that require authentication.
- Use `with-auth` middleware for all API routes that require authentication.

## Naming Conventions

- **file name** → kebab-case (e.g., `user-profile.tsx`)
- **class name** → PascalCase (e.g., `UserService`)
- **function name** → camelCase (e.g., `getUserData`)
- **constant name** → UPPER_SNAKE_CASE (e.g., `MAX_UPLOAD_SIZE`)
- **variable name** → underscore_case (e.g., `user_data`)
- **types and interfaces** → PascalCase (e.g., `UserProfile`)
- **component name** → PascalCase (e.g., `UserCard`)
- **hooks** → camelCase with 'use' prefix (e.g., `useUserData`)

## File Structure

- **Types**: Place all type definitions in the `types` directory.
- **Models**: Place all Mongoose models in the `models` directory.
- **Services**: Place all service classes in the `services` directory.
- **API Routes**: Place all API route handlers in the `app/api` directory.
- **Components**: Place all React components in the `components` directory with sub-directories for each feature or domain.
- **Utils**: Place all utility functions in the `utils` directory.
- **Hooks**: Place custom React hooks in the `hooks` directory.
- **Constants**: Place application constants in the `constants` directory.
- **Middleware**: Place middleware functions in the `middleware` directory.

## Code Quality Standards

- Write clean, readable, and maintainable code.
- Add comments for complex logic and business rules.
- Use meaningful variable and function names.
- Follow DRY (Don't Repeat Yourself) principle.
- Implement proper error handling with try-catch blocks.
- Use async/await instead of promises when possible.
- Validate all user inputs and sanitize data.
- Implement proper TypeScript types - avoid using `any`.

## Component Guidelines

- Keep components small and focused on a single responsibility.
- Extract reusable logic into custom hooks.
- Use proper prop types and interfaces.
- Implement proper loading and error states.
- Use React Server Components where appropriate.

## API Development

- Use RESTful conventions for API endpoints.
- Return consistent response formats (success/error).
- Implement proper HTTP status codes.
- Add rate limiting for public endpoints.
- Log errors and important operations.

## Database Operations

- Define Mongoose schemas with proper TypeScript types.
- Use Mongoose model methods for database operations.
- Implement proper indexing for performance optimization.
- Use transactions for operations that require atomicity.
- Always validate data before saving to database.

## Documentation

- After implementing new features, update the relevant documentation files in the `docs` directory.
- Ensure to include any new API endpoints, data structures, or configuration steps.
- In `docs` directory maintain sub-directories for different categories:
  - `API` - API endpoint documentation
  - `Setup` - Installation and setup guides
  - `Guides` - Feature usage guides
  - `Features` - Feature specifications
  - `References` - Technical references and architecture
- Use markdown format for all documentation.
- Include code examples where applicable.

## Version Control

- Write clear and descriptive commit messages.
- Keep commits atomic and focused.
- Update CHANGELOG.md for significant changes.
