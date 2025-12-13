# Development Guide

## Project Structure

```
pipeflow/
├── src/
│   ├── App.tsx                 # Main application component
│   ├── components/
│   │   └── GameCanvas.tsx      # Skia canvas component for game rendering
│   ├── types/
│   │   └── game.ts            # TypeScript type definitions
│   └── utils/
│       └── gameLogic.ts       # Game logic utilities
├── __tests__/                  # Test files
│   ├── App.test.tsx
│   └── gameLogic.test.ts
└── index.js                    # Entry point
```

## Key Components

### GameCanvas.tsx
This is the main game component that uses Skia for rendering:
- Uses `@shopify/react-native-skia` primitives (Canvas, Circle, Line, Path)
- Manages game state with React hooks
- Handles touch interactions for rotating pipes
- Renders the game grid and pipe connections

### Game Logic
The game logic includes:
- **Pipe Types**: STRAIGHT, CORNER, T_JUNCTION, CROSS
- **Directions**: UP, RIGHT, DOWN, LEFT
- **Connection Checking**: Validates if pipes connect properly
- **Rotation**: Pipes can be rotated in 90° increments

## Skia Integration

The game uses Skia's high-performance rendering:
- **Canvas**: Main drawing surface
- **Circle**: Renders pipe centers
- **Line**: Draws grid lines
- **Path**: Creates pipe segments
- **vec**: Helper for creating 2D vectors

## Testing

Run tests:
```bash
npm test
```

Tests cover:
- Game logic (pipe connections, rotations)
- Component rendering

## Adding New Features

### Adding a New Pipe Type
1. Add the type to `PipeType` enum in `src/types/game.ts`
2. Define its base connections in `getConnectionsForPipe` in `src/utils/gameLogic.ts`
3. Add rendering logic in `GameCanvas.tsx`

### Modifying the Grid Size
Change the `GRID_SIZE` constant in `GameCanvas.tsx`

### Adding Levels
Create different initial game states in the `initializeGame` function
