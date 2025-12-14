# GitHub Copilot Instructions for PipeFlow

## Project Overview

PipeFlow is a visual prototype for a mathematical puzzle game built with React Native and Skia. This is a UI/UX prototype focusing on drag-and-drop interactions and visual rendering, intentionally without game logic implementation.

**Current Status**: Visual Prototype - UI/UX and interactions implemented without game logic or validation.

## Technology Stack

- **React Native 0.72.6** - Mobile app framework
- **TypeScript 5.0.4** - Type-safe JavaScript
- **@shopify/react-native-skia** - High-performance canvas rendering
- **react-native-gesture-handler** - Drag & drop interactions
- **Jest** - Unit testing framework
- **Detox** - End-to-end testing framework
- **ESLint** - Code linting (extends `@react-native`)

## Project Structure

```
src/
├── App.tsx                      # Main application component
├── screens/
│   └── PipeflowScreen.tsx       # Main game screen with drag & drop
├── components/
│   └── GameCanvas.tsx           # Legacy pipe-rotation game (not used)
├── types/
│   ├── game.ts                  # Legacy types (not used)
│   └── pipeflow.ts              # Types for mathematical operations game
└── utils/
    └── gameLogic.ts             # Legacy game logic (not used)
```

## Development Workflow

### Building and Running
- **iOS**: `npm run ios`
- **Android**: `npm run android`
- **Start Metro**: `npm start`

### Testing
- **Unit tests**: `npm test`
- **Linting**: `npm run lint`
- **E2E tests (iOS)**: `npm run e2e:build && npm run e2e:test`
- **E2E tests (Android)**: `npm run e2e:build:android && npm run e2e:test:android`

### Pre-commit Checklist
1. Run `npm run lint` to check code style
2. Run `npm test` to ensure tests pass
3. Verify TypeScript compilation with no errors

## Code Style and Guidelines

### TypeScript
- Use **strict mode** (enabled in tsconfig.json)
- Always define proper interfaces for components and data structures
- Prefer named exports over default exports for better refactoring
- Use `interface` for object shapes, `type` for unions/intersections

### React Native
- Use functional components with hooks (no class components)
- Follow React hooks rules and dependencies
- Keep components focused and single-purpose
- Use `StyleSheet.create()` for styles

### Skia Integration
- Import Skia components from `@shopify/react-native-skia`
- Use Skia for high-performance rendering: `Canvas`, `Circle`, `Path`, `Text`
- Create font configurations with `matchFont()`
- Keep Skia rendering logic declarative

### Gesture Handler
- Wrap screens with `GestureHandlerRootView`
- Use `GestureDetector` with `Gesture.Pan()` for drag interactions
- Handle gesture states: `onBegin`, `onUpdate`, `onEnd`

### File Naming
- Components: PascalCase (e.g., `PipeflowScreen.tsx`)
- Types: camelCase (e.g., `pipeflow.ts`)
- Utils: camelCase (e.g., `gameLogic.ts`)
- Tests: Match source file with `.test.tsx` suffix

### Comments
- Add JSDoc comments for complex functions and interfaces
- Explain "why" not "what" in code comments
- Document component props and return types
- Keep comments concise and up-to-date

## Testing Guidelines

### Unit Tests
- Mock `@shopify/react-native-skia` and `react-native-gesture-handler` (configured in `jest.setup.js`)
- Test component rendering and state changes
- Use `@testing-library/react-native` patterns
- Keep tests focused and isolated

### E2E Tests
- Place tests in `e2e/` directory
- Use Detox matchers for UI interactions
- Capture screenshots with `--take-screenshots all`
- See `E2E_TESTING.md` for detailed guidelines

## Common Patterns

### Level Configuration
Levels are defined in `PipeflowScreen.tsx` using `createLevels()`:
```typescript
{
  id: number,
  inputValue: number,
  goalValue: number,
  slots: ComponentSlot[],
  availableComponents: Component[],
  connections: Connection[]
}
```

### Component Types
- **Input Node**: Teal circle showing starting value
- **Output Node**: Purple circle showing goal value
- **Component Slots**: Placeholders for operations
- **Components**: Draggable operation cards (×2, +1, +)
- **Connections**: Visual pipes connecting elements

### Color Palette
- Input node: `#14B8A6` (teal)
- Output node: `#8B5CF6` (purple)
- Components: `#60A5FA` (blue)
- Pipes: `#60A5FA` (blue)
- Slots: `#E5E7EB` (gray)
- Highlight: `#FCD34D` (yellow)

## What NOT to Implement

This is a visual prototype. DO NOT implement:
- ❌ Game logic and validation
- ❌ Mathematical calculations
- ❌ Complex animations beyond basic highlighting
- ❌ Sound effects
- ❌ Level progression or win conditions
- ❌ Component removal from tray after placement

These are intentionally excluded to keep the prototype focused on UI/UX.

## Special Considerations

### Performance
- Skia rendering is highly performant; avoid unnecessary re-renders
- Use `useCallback` for gesture handlers to prevent recreation
- Memoize complex calculations in level creation

### Mobile-First Design
- Target portrait orientation primarily
- Use large touch targets (minimum 44x44 points)
- Test on both iOS and Android devices
- Consider safe areas for notched devices

### TypeScript Strictness
- No implicit `any` types allowed
- Properly type all props and state
- Use type guards when necessary
- Leverage discriminated unions for complex state

## Adding New Features

### Adding a New Level
1. Add level object to `createLevels()` array in `PipeflowScreen.tsx`
2. Define slot positions with `{x, y}` coordinates
3. Specify available components with symbols and operations
4. Define visual connections between elements

### Adding a New Component Type
1. Add to level's `availableComponents` array
2. Provide `symbol` (display text), optional `operation` and `operand`
3. For multi-input components, set `inputPorts: 2`

### Modifying Visual Style
- Colors are defined inline in components
- Constants at top of `PipeflowScreen.tsx`: `NODE_RADIUS`, `COMPONENT_WIDTH`, etc.
- Maintain existing teal/blue/gray/purple color scheme

## Dependencies

When adding dependencies:
- Prefer stable, well-maintained packages
- Check React Native compatibility (avoid web-only packages)
- Update `package.json` and run `npm install`
- For native dependencies, run `cd ios && pod install` (iOS)

## Documentation

- Update `README.md` for user-facing changes
- Update `DEVELOPMENT.md` for technical/architectural changes
- Update `E2E_TESTING.md` for testing infrastructure changes
- Keep inline documentation synchronized with code
