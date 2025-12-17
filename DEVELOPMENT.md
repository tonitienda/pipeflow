# Development Guide

## Project Structure

```
pipeflow/
├── src/
│   ├── App.tsx                     # Main application component
│   ├── screens/
│   │   └── PipeflowScreen.tsx      # Main game screen with drag & drop
│   ├── components/
│   │   └── GameCanvas.tsx          # Legacy pipe-rotation game (not used)
│   ├── types/
│   │   ├── game.ts                 # Legacy types (not used)
│   │   └── pipeflow.ts             # Types for mathematical operations game
│   └── utils/
│       └── gameLogic.ts            # Legacy game logic (not used)
├── __tests__/                       # Test files
│   ├── App.test.tsx                 # Main app snapshot tests
│   ├── PipeflowScreen.test.tsx      # Game screen snapshot tests
│   └── gameLogic.test.ts            # Legacy logic tests
├── .github/
│   └── workflows/
│       └── ci.yml                   # CI workflow for tests
├── jest.setup.js                    # Jest configuration and mocks
├── jest.config.js                   # Jest configuration
└── index.js                         # Entry point
```

## Technology Stack

- **React Native 0.83.0** - Latest stable release (Dec 2024)
- **React 19.0.0** - Latest React
- **@shopify/react-native-skia 2.4.7** - Canvas rendering
- **react-native-gesture-handler 2.22.2** - Gestures and drag/drop
- **@testing-library/react-native 12.9.0** - Component testing
- **Jest 29.7.0** - Test runner

## Key Components

### PipeflowScreen.tsx

This is the main game screen component:

- Uses `@shopify/react-native-skia` primitives (Canvas, Circle, Path, Text)
- Uses `react-native-gesture-handler` for drag & drop
- Manages game state with React hooks
- Renders the game board with Skia canvas
- Implements three hardcoded levels with different configurations
- Handles component drag and drop with visual feedback

### Types (pipeflow.ts)

The game uses these main types:

- **Node**: Input/output nodes with values
- **Component**: Mathematical operations (×2, +1, etc.)
- **ComponentSlot**: Placeholders on the board for components
- **Connection**: Visual pipe connections between elements
- **Level**: Complete level configuration
- **GameState**: Overall game state

## Skia Integration

The game uses Skia's high-performance rendering:

- **Canvas**: Main drawing surface
- **Circle**: Renders nodes and ports
- **Path**: Creates curved pipes and component backgrounds
- **Text**: Renders numbers and operation symbols
- **matchFont**: Creates font configuration for text

## Gesture Handler Integration

Drag & drop functionality:

- **GestureHandlerRootView**: Wraps the entire screen
- **GestureDetector**: Detects pan gestures on components
- **Gesture.Pan()**: Handles drag start, update, and end events

## Testing

Run tests:

```bash
npm test
```

Tests include:

- Component rendering tests
- Legacy game logic tests (for reference)

### Test Mocks

Jest is configured to mock:

- `@shopify/react-native-skia` - Canvas rendering APIs
- `react-native-gesture-handler` - Gesture detection APIs

Mocks are defined in `jest.setup.js`.

## Level Configuration

Levels are hardcoded in `PipeflowScreen.tsx` using the `createLevels()` function:

```typescript
const createLevels = (): Level[] => {
  return [
    // Level 1: Simple operation
    {
      id: 1,
      inputValue: 1,
      goalValue: 2,
      slots: [...],
      availableComponents: [...],
      connections: [...],
    },
    // ... more levels
  ];
};
```

Each level defines:

- Input and goal values
- Component slot positions
- Available components in the tray
- Visual connections (pipes) to draw

## Adding New Features

### Adding a New Level

1. Add a new level object to the `createLevels()` function array
2. Define slot positions (hardcoded x, y coordinates)
3. Define available components
4. Define visual connections

### Adding a New Component Type

1. Add the component to a level's `availableComponents` array
2. Include the symbol (display text like "×3")
3. Optionally specify operation and operand
4. For multi-input components, set `inputPorts: 2`

### Modifying Visual Style

- Colors are defined inline in the component
- Node radius and component sizes are constants at the top of `PipeflowScreen.tsx`
- Teal/blue/gray color palette:
  - Input node: `#14B8A6` (teal)
  - Output node: `#8B5CF6` (purple)
  - Components: `#60A5FA` (blue)
  - Pipes: `#60A5FA` (blue)
  - Slots: `#E5E7EB` (gray)
  - Highlight: `#FCD34D` (yellow)

## Testing Locally

### Unit Tests & Linting (No special setup needed)

```bash
npm run lint          # Run ESLint
npm test              # Run Jest unit tests
npx tsc --noEmit      # TypeScript type checking
```

### iOS E2E Tests (Requires Xcode)

```bash
npm run e2e:build     # Build iOS app for testing
npm run e2e:test      # Run Detox E2E tests
```

### Android E2E Tests

#### Option A: Using Docker (Recommended - no local Java/Android SDK needed)

```bash
# Build Android APKs using Docker
./scripts/android-build-docker.sh

# Build E2E test APKs
./scripts/android-test-docker.sh
```

The Docker approach uses the official React Native Android image and avoids installing Java 17 and Android SDK locally.

#### Option B: Native Build (Requires Java 17 + Android SDK)

```bash
# Install Java 17
brew install openjdk@17
export JAVA_HOME="/opt/homebrew/opt/openjdk@17"

# Build
cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug
```

## Current Limitations (By Design)

This is a visual prototype, so:

- No game logic or validation is implemented
- Components can be placed multiple times (no removal from tray)
- No calculations are performed
- No win/lose conditions
- No animations beyond basic highlighting
- Layout is hardcoded per level (no generic layout engine)

## Future Development

When implementing game logic:

1. Add calculation engine in `src/utils/`
2. Add validation for component placement
3. Add execution flow visualization
4. Add win/lose detection
5. Add level progression system
6. Consider adding a generic layout engine for easier level creation
