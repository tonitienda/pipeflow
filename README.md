# PipeFlow

A visual prototype for a mathematical puzzle game built with React Native and Skia.

## Description

PipeFlow is a puzzle game where you solve mathematical challenges by dragging and dropping operation components (like ×2, +1) onto a board. The game uses Skia for rendering beautiful curved pipes and smooth graphics.

**Current Status**: Visual Prototype - UI/UX and interactions implemented without game logic or validation.

## Features

- **Skia-powered graphics**: Uses `@shopify/react-native-skia` for high-performance canvas rendering
- **Drag & Drop**: Intuitive component placement using `react-native-gesture-handler`
- **Visual feedback**: Slot highlighting when valid components are dragged over them
- **Three levels**: Demonstrates different puzzle configurations
  - Level 1: Simple operation (1 → ×2 → 2)
  - Level 2: Sequential operations (1 → ×2 → +1 → 3)
  - Level 3: Fan-out with multiple inputs (branching and combining)
- **Clean UI**: Calm, minimal visual style with teal/blue/gray palette
- **Mobile-friendly**: Large touch targets designed for portrait orientation

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run on iOS:
   ```bash
   npm run ios
   ```

3. Run on Android:
   ```bash
   npm run android
   ```

## Game Elements

- **Input Node**: Teal circle showing the starting value
- **Output Node**: Purple circle showing the goal value
- **Component Slots**: Rounded rectangles where operations are placed
- **Components**: Draggable operation cards (×2, +1, +)
- **Pipes**: Curved Bezier paths connecting nodes and components

## Controls

- **Drag components** from the tray at the bottom
- **Drop onto slots** on the board (highlights when valid)
- **Switch levels** using the Prev/Next buttons (for testing)

## What's NOT Implemented (By Design)

This is a visual prototype focusing on UI/UX. The following are intentionally not implemented:
- ❌ Game logic and validation
- ❌ Mathematical calculations
- ❌ Animations beyond basic highlighting
- ❌ Sound effects
- ❌ Level progression or win conditions
- ❌ Component removal from tray after placement

## Technology Stack

- React Native 0.72.6
- @shopify/react-native-skia for canvas rendering
- react-native-gesture-handler for drag & drop
- TypeScript for type safety
- React hooks for state management

## Testing

Run unit tests:
```bash
npm test
```

Run linter:
```bash
npm run lint
```

### E2E Testing

End-to-end tests are available using Detox. See [E2E_TESTING.md](E2E_TESTING.md) for detailed instructions.

Quick start:
```bash
# Build the app for E2E testing
npm run e2e:build

# Run E2E tests with screenshot capture
npm run e2e:test
```

Screenshots are saved to `e2e/artifacts/` after test execution.

## Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed development information.
