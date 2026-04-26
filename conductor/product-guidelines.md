# Product Guidelines: React Sidekick Menu

## Prose Style
- **Tone:** Professional, clear, and concise. Documentation should follow an industry-standard technical style that is easy for developers to navigate and understand.
- **Clarity:** Prioritize unambiguous explanations and direct instructions in all developer-facing materials (API docs, READMEs, etc.).

## UX Principles
- **Performance-first:** Prioritize fast interactions, minimal layout shifts, and efficient rendering (e.g., using caching for dynamic visibility and optimized re-renders for deep nesting).
- **Accessibility-centric:** Adhere strictly to WCAG 2.1 AA standards or higher. Ensure full keyboard navigation, ARIA role compliance, and screen reader friendliness.
- **Aesthetic Excellence:** Even with a neutral visual identity, the component must feel polished, modern, and reliable. Animations should be purposeful and smooth.

## Visual Identity & Theming
- **Theme Support:** Inbuilt support for **Dark**, **Light**, and **System** themes is a mandatory core feature. The component must automatically adapt to the user's system preferences or an explicit theme override.
- **Neutrality:** The default UI should be clean and neutral, acting as a high-quality foundation that can be further customized by the host application.

## Developer Experience (DX)
- **Ease of Use:** Minimize the boilerplate required to get a basic menu running while providing deep configuration for advanced use cases.
- **Type Safety:** Leverage TypeScript to provide robust autocompletion and compile-time checks for all props and data structures.
