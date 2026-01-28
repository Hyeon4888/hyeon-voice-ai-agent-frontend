# System Design & Component Rules

This document outlines the architectural and stylistic rules for the Voice AI Agent frontend. All AI agents and developers must adhere to these guidelines.

## 1. Component Architecture
- **Reusability First**: Every component should be designed with reusability in mind. Avoid hardcoding content; always use `props`.
- **Atomic Design**: Break down complex interfaces into smaller, atomic components.
- **Isolation**: Components should be self-contained. Avoid tight coupling with global state where props will suffice.

## 2. UI Library: Shadcn UI
- **Mandatory Usage**: All UI elements (buttons, inputs, dialogs, cards, etc.) **MUST** use [Shadcn UI](https://ui.shadcn.com/) components.
- **Do Not Re-invent**: Do not create custom buttons or inputs unless they are specialized wrappers around Shadcn primitives.
- **Location**:
    - All Shadcn components reside in `@/components/ui`.
    - Do not modify the core logic of these components unless necessary for global behavior changes.

## 3. Imports & Exports
- **Named Exports**: Always use named exports for components.
  ```tsx
  // Good
  export function MyComponent() { ... }
  ```
- **Absolute Imports**: Use absolute paths for importing components to maintain clarity.
  ```tsx
  // Good
  import { Button } from "@/components/ui/button";
  
  // Bad
  import { Button } from "../../components/ui/button";
  ```

## 4. File Structure
- **Generic Components**: Place reusable, generic components in `components/shared` or `components/ui` (for Shadcn).
- **Page-Specific Components**: Create a folder in `@/components` named after the feature/page (e.g., `@/components/agent` for `@/app/agent`) and place relevant components there.
- **Feature Components**: Place feature-specific components in `components/<feature-name>`.

## 5. Styling
- **Tailwind CSS**: Use Tailwind CSS for all styling.
- **Consistency**: Utilize the design tokens (colors, radius) defined in `globals.css` and `tailwind.config.ts` via Shadcn.

## 6. API Structure
- **Location**: All API handling code must reside in `@/lib/api`.
- **Entity Folders**: Create a dedicated folder for each entity (e.g., `@/lib/api/agent`, `@/lib/api/auth`).
- **File Naming**: Inside the entity folder, create files named appropriately for their purpose (e.g., `crud-agent.ts` for CRUD operations, `auth-api.ts` for authentication).
- **Client Instance**: The base Axios instance should be configured in a shared file (e.g., `@/lib/api/client.ts`) and imported by entity API modules.
