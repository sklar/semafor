# Code Standards

This project uses **Biome** for formatting and linting.

## Quick Reference

- **Check for issues**: `pnpm biome check`
- **Auto-fix**: `pnpm biome check --write`

Most issues are automatically fixable.

---

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type Safety & Explicitness

- Use explicit types for function parameters and return values when they enhance clarity
- Prefer `unknown` over `any` when the type is genuinely unknown
- Use const assertions (`as const`) for immutable values and literal types
- Leverage TypeScript's type narrowing instead of type assertions
- Use meaningful variable names instead of magic numbers - extract constants with descriptive names

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks and short functions
- Prefer `for...of` loops over `.forEach()` and indexed `for` loops
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safer property access
- Prefer template literals over string concatenation
- Use destructuring for object and array assignments
- Use `const` by default, `let` only when reassignment is needed, never `var`

### Async & Promises

- Always `await` promises in async functions - don't forget to use the return value
- Use `async/await` syntax instead of promise chains for better readability
- Handle errors appropriately in async code with try-catch blocks
- Don't use async functions as Promise executors

### Astro & MDX

- Astro components (`.astro`) use frontmatter fences (`---`) for server-side logic
- MDX files support JSX components — import them at the top after frontmatter
- Starlight components: `Aside`, `Badge`, `Steps`, `CardGrid`, `LinkCard`, `Tabs`, `TabItem`
- Custom components: `Banner`, `Skill`, `SkillItem` (import from `@/components/`)
- Path alias: `@/*` resolves to `./src/*`
- Avoid `<->`, `<=>` and similar angle-bracket patterns in MDX text — use Unicode arrows
- Czech curly quotes (`„"`) break inside JSX attribute values — use straight quotes in attributes

### Error Handling & Debugging

- Remove `console.log`, `debugger`, and `alert` statements from production code
- Throw `Error` objects with descriptive messages, not strings or other values
- Use `try-catch` blocks meaningfully - don't catch errors just to rethrow them
- Prefer early returns over nested conditionals for error cases

### Code Organization

- Keep functions focused and under reasonable cognitive complexity limits
- Extract complex conditions into well-named boolean variables
- Use early returns to reduce nesting
- Prefer simple conditionals over nested ternary operators
- Group related code together and separate concerns

### Security

- Avoid `dangerouslySetInnerHTML` unless absolutely necessary
- Don't use `eval()` or assign directly to `document.cookie`
- Validate and sanitize user input

### Performance

- Avoid spread syntax in accumulators within loops
- Use top-level regex literals instead of creating them in loops
- Prefer specific imports over namespace imports
- Avoid barrel files (index files that re-export everything)

### Accessibility

- Use semantic HTML elements (`<button>`, `<nav>`, etc.)
- Provide meaningful alt text for images
- Use proper heading hierarchy

---

Most formatting and common issues are automatically fixed by Biome. Run `pnpm biome check --write` before committing.
