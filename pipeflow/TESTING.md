# Unit Testing Notes

## Jest Configuration

This project uses Jest for unit testing with the following configuration:

### Preset

The Jest configuration uses `react-native` preset instead of `jest-expo` due to compatibility issues with:
- React Native 0.81.5
- React 19.1.0
- jest-expo ~52.0.4 has issues with UIManager mock setup and Flow type syntax

`jest-expo` is still included in devDependencies as it may be useful in the future when compatibility improves.

### Test Scripts

- `npm test` - Run tests with coverage
- `npm test:watch` - Run tests in watch mode

### Test Structure

Tests are organized in the `__tests__` directory:
- `App.test.tsx` - Tests for main App component
- `components/PipeflowScreen.test.tsx` - Tests for PipeflowScreen component  
- `types/pipeflow.test.ts` - Tests for TypeScript type definitions

### Mocks

The `jest.setup.js` file includes mocks for:
- `react-native-svg` - SVG components
- `@shopify/react-native-skia` - Skia rendering library
- `react-native-gesture-handler` - Gesture handling
- `react-native-reanimated` - Animation library

### Known Limitations

Component tests use simple instantiation checks rather than full rendering due to React Native Testing Library compatibility issues with Flow syntax in React Native 0.81.5.
