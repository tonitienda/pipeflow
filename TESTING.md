# Testing Guide

## Overview

PipeFlow uses **component snapshot testing** with Jest and React Native Testing Library. This approach allows us to:

- ✅ Test component rendering without simulators/emulators
- ✅ Generate visual snapshots for PR review
- ✅ Run tests quickly in CI/CD
- ✅ Verify UI changes without manual testing

## Running Tests

### Locally

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Update snapshots after intentional UI changes
npm run test:update-snapshots

# Run with coverage report
npm test -- --coverage
```

### In CI

Tests run automatically on:

- Push to `main`/`master` branches
- Pull requests to `main`/`master`

CI outputs:

- Test snapshots (uploaded as artifacts)
- Coverage reports (uploaded as artifacts)
- PR comment with test summary

## Snapshot Testing

### What are Snapshots?

Snapshots capture the rendered component tree and save it as a reference. Future test runs compare against this reference to detect unintended changes.

### When to Update Snapshots

Update snapshots when you've made **intentional** UI changes:

```bash
npm run test:update-snapshots
```

⚠️ **Warning**: Only update snapshots after verifying changes are correct!

### Reviewing Snapshots in PRs

1. Check the uploaded snapshot artifacts in GitHub Actions
2. Compare with previous snapshots to verify changes
3. Review the diff in `__tests__/__snapshots__/` files

## Test Structure

### Component Tests

Tests are located in `__tests__/` directory:

- `App.test.tsx` - Main app component
- `PipeflowScreen.test.tsx` - Game screen with full layout
- `gameLogic.test.ts` - Game logic utilities

### Screenshot Strategy

We focus on **full screen snapshots** rather than individual component snapshots to:

- Get a complete view of the UI
- Reduce the number of test files to maintain
- Make PR reviews easier with comprehensive screenshots

## CI Workflow

### What CI Does

1. **Install dependencies** - `npm ci`
2. **Lint code** - `npm run lint`
3. **Run tests** - `npm test` (with coverage)
4. **Upload artifacts**:
   - Test snapshots from `__tests__/__snapshots__/`
   - Coverage reports from `coverage/`
5. **Comment on PR** - Summary of test results

### Artifacts

After each CI run, download artifacts to review:

- **test-snapshots** - JSON snapshots of rendered components
- **coverage-report** - HTML coverage report

## Writing New Tests

### Example: Screen Snapshot Test

```typescript
import React from 'react';
import {render} from '@testing-library/react-native';
import MyScreen from '../src/screens/MyScreen';

describe('MyScreen', () => {
  it('renders the complete screen correctly', () => {
    const {toJSON} = render(<MyScreen />);
    expect(toJSON()).toMatchSnapshot();
  });
});
```

### Example: Component with Interaction

```typescript
import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import MyButton from '../src/components/MyButton';

describe('MyButton', () => {
  it('renders and handles press', () => {
    const onPress = jest.fn();
    const {getByText, toJSON} = render(
      <MyButton onPress={onPress} title="Click me" />,
    );

    // Test interaction
    fireEvent.press(getByText('Click me'));
    expect(onPress).toHaveBeenCalled();

    // Snapshot
    expect(toJSON()).toMatchSnapshot();
  });
});
```

## Best Practices

### ✅ Do

- Write focused tests that verify specific behavior
- Take full-screen snapshots for UI review
- Update snapshots consciously after UI changes
- Review snapshot diffs in PRs carefully
- Keep tests fast and isolated

### ❌ Don't

- Update snapshots blindly without reviewing changes
- Test implementation details
- Make tests dependent on each other
- Skip snapshot reviews in PRs

## Mocking

### Skia Components

Skia components are automatically mocked in `jest.setup.js`:

```javascript
jest.mock('@shopify/react-native-skia', () => ({
  Canvas: 'Canvas',
  Circle: 'Circle',
  // ... other mocks
}));
```

### Gesture Handler

Gesture handler is mocked to prevent native module errors:

```javascript
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: 'GestureHandlerRootView',
  // ... other mocks
}));
```

## Troubleshooting

### Tests fail after React Native upgrade

1. Delete `node_modules` and `package-lock.json`
2. Run `npm install`
3. Clear Jest cache: `npx jest --clearCache`
4. Update snapshots if UI changed: `npm run test:update-snapshots`

### Snapshot diff is too large

This usually means:

- Major UI changes were made
- Component props changed significantly
- Consider reviewing the changes carefully before updating

### CI fails but tests pass locally

1. Check Node.js version matches CI (v18)
2. Use `npm ci` instead of `npm install`
3. Check for platform-specific code
4. Review CI logs for specific errors

## Coverage Goals

Aim for:

- **80%+ statement coverage** for new code
- **70%+ branch coverage** for conditional logic
- **100% coverage** for critical game logic

Coverage reports are generated in `coverage/` directory after running tests.
