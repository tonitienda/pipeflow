# E2E Testing Documentation

## Overview

This project uses [Detox](https://wix.github.io/Detox/) as the E2E testing framework for React Native. Detox provides gray-box testing capabilities, allowing us to test the app in a realistic environment while capturing screenshots during test execution.

## Prerequisites

Before running E2E tests locally, ensure you have:

- Node.js 16 or higher (check `package.json` engines)

### For Android Testing (Recommended for CI)
- Android SDK installed
- Android Emulator configured
- Java Development Kit (JDK) 17 or higher

### For iOS Testing (Local development)
- Xcode (macOS only)
- CocoaPods installed (`gem install cocoapods`)
- iOS Simulator available

## Running E2E Tests Locally

### Android Tests (Recommended)

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Create Android Emulator

Create an AVD (Android Virtual Device) that matches the CI configuration:

```bash
# List available system images
sdkmanager --list | grep system-images

# Install the required system image if not already installed
sdkmanager "system-images;android-31;google_apis;x86_64"

# Create the AVD (without specific device profile)
avdmanager create avd -n Pixel_3a_API_31_x86 -k "system-images;android-31;google_apis;x86_64"
```

#### 3. Build the App for Testing

```bash
npm run e2e:build:android
```

This command builds the Android app in debug mode for the emulator.

#### 4. Run E2E Tests

Start the emulator first, then run tests:

```bash
# Start emulator in background
emulator -avd Pixel_3a_API_31_x86 &

# Wait for emulator to boot, then run tests
npm run e2e:test:android
```

### iOS Tests (Local development only)

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Install iOS Dependencies

```bash
cd ios && pod install && cd ..
```

#### 3. Build the App for Testing

```bash
npm run e2e:build
```

This command builds the iOS app in debug mode for the simulator.

#### 4. Run E2E Tests

```bash
npm run e2e:test
```

This command:
- Launches the iOS simulator
- Runs all E2E tests located in the `e2e/` directory
- Captures screenshots during test execution
- Saves screenshots to `e2e/screenshots/`

## Test Structure

E2E tests are located in the `e2e/` directory:

```
e2e/
├── jest.config.js          # Jest configuration for Detox
├── pipeflow.test.js        # Main E2E test suite
└── screenshots/            # Screenshot output directory (git-ignored)
```

## Available Test Suites

### pipeflow.test.js

This test suite verifies:
- ✅ App launches successfully
- ✅ Main game screen renders correctly
- ✅ Component tray is visible with draggable components
- ✅ Level navigation works (Prev/Next buttons)
- ✅ Screenshots are captured at key points

## Screenshot Capture

Screenshots and artifacts are automatically captured during test execution:

- **Location**: `e2e/artifacts/`
- **Format**: PNG files with descriptive names
- **Naming**: Sequential numbers with descriptive labels (e.g., `01-app-launched.png`)
- **Capture Points**:
  - App launch
  - Main game screen
  - Component tray
  - Each level transition
  - Final state
  - On test failures

### Viewing Local Screenshots

After running tests, screenshots are saved to:

```
e2e/artifacts/
```

Open this folder to view all captured screenshots from your test run.

## CI/CD Integration

### GitHub Actions Workflow

E2E tests run automatically on pull requests via the `.github/workflows/e2e-tests.yml` workflow.

The workflow:
1. Triggers on pull requests to `main` or `master` branches
2. Runs on `ubuntu-latest` for Android emulator support
3. Sets up Node.js environment (v18) and Java 17
4. Installs dependencies
5. Builds the Android app for testing
6. Enables KVM for hardware acceleration
7. Runs E2E tests with screenshot capture on Android emulator (API 31)
8. Uploads screenshots as GitHub Actions artifacts

### Viewing Screenshots from CI

To view screenshots captured during CI runs:

1. Go to the **Actions** tab in the GitHub repository
2. Click on the workflow run for your pull request
3. Scroll to the **Artifacts** section at the bottom
4. Download the `e2e-screenshots` artifact
5. Extract the ZIP file to view all screenshots

**Note**: Screenshots are retained for 30 days.

## Adding New E2E Tests

### 1. Create or Edit Test Files

Add new test cases to existing files or create new test files in the `e2e/` directory:

```javascript
// e2e/myfeature.test.js
const {device, element, by, expect: detoxExpect} = require('detox');

describe('My Feature', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should do something', async () => {
    await detoxExpect(element(by.id('my-element'))).toBeVisible();
    await device.takeScreenshot('my-feature-screenshot');
  });
});
```

### 2. Add testID to React Components

For Detox to find elements, add `testID` props:

```tsx
<View testID="my-element">
  <Text>My Content</Text>
</View>
```

### 3. Capture Screenshots

Use `device.takeScreenshot()` to capture screenshots at important points:

```javascript
await device.takeScreenshot('descriptive-name');
```

### 4. Run Tests

For Android:
```bash
npm run e2e:test:android
```

For iOS:
```bash
npm run e2e:test
```

## Configuration

### Detox Configuration (.detoxrc.js)

The Detox configuration file defines:

- **Test runner**: Jest
- **App build configurations**: 
  - iOS debug build for iPhone 13 simulator
  - Android debug build for Pixel 3a API 30 emulator
- **Devices**: 
  - iOS: iPhone 13 simulator
  - Android: Pixel_3a_API_31_x86 emulator (used in CI)
- **Artifacts**: Screenshot settings

### Screenshot Settings

Screenshots are configured in `.detoxrc.js`:

```javascript
artifacts: {
  rootDir: './e2e/artifacts',
  plugins: {
    screenshot: {
      enabled: true,
      shouldTakeAutomaticSnapshots: true,
      keepOnlyFailedTestsArtifacts: false,
      takeWhen: {
        testStart: false,
        testDone: true,
        testFailure: true,
      },
    },
    log: {
      enabled: true,
      keepOnlyFailedTestsArtifacts: false,
    },
  },
}
```

This configuration:
- Saves screenshots and logs to `e2e/artifacts/`
- Captures screenshots when tests complete and on failures
- Keeps screenshots from both passing and failing tests
- Allows manual screenshots via `device.takeScreenshot()`
- Captures device logs for debugging

## Troubleshooting

### Android Build Failures

If `npm run e2e:build:android` fails:

1. Ensure Android SDK is installed and configured
2. Check that ANDROID_HOME environment variable is set
3. Try cleaning the build: `cd android && ./gradlew clean && cd ..`
4. Verify Java version: `java -version` (should be 17 or higher)

### iOS Build Failures

If `npm run e2e:build` fails:

1. Ensure Xcode is installed and up-to-date
2. Run `cd ios && pod install && cd ..`
3. Try cleaning the build: `rm -rf ios/build`
4. Check that the iOS workspace exists: `ls ios/*.xcworkspace`

### Test Failures

For Android tests:

1. Check that the emulator is running: `adb devices`
2. Ensure the app builds successfully: `npm run e2e:build:android`
3. Check test logs for specific error messages
4. Review screenshots in `e2e/artifacts/` for visual clues

For iOS tests:

1. Check that the simulator is available: `xcrun simctl list devices`
2. Ensure the app builds successfully: `npm run e2e:build`
3. Check test logs for specific error messages
4. Review screenshots in `e2e/artifacts/` for visual clues

### Emulator/Simulator Issues

For Android:

1. List available AVDs: `emulator -list-avds`
2. Start emulator manually: `emulator -avd Pixel_3a_API_31_x86`
3. Check emulator logs: `adb logcat`

For iOS:

1. Boot the simulator manually: `xcrun simctl boot "iPhone 13"`
2. Try a different simulator device
3. Reset the simulator: `xcrun simctl erase "iPhone 13"`

## Best Practices

1. **Use descriptive testIDs**: Make element selection clear and maintainable
2. **Capture screenshots strategically**: Focus on key user journeys and states
3. **Keep tests focused**: Each test should verify one specific behavior
4. **Use waitFor**: Wait for elements to appear before interacting
5. **Clean up state**: Use `beforeEach` to reset app state between tests
6. **Name screenshots clearly**: Use descriptive names that explain what they show

## Resources

- [Detox Documentation](https://wix.github.io/Detox/)
- [Detox API Reference](https://wix.github.io/Detox/docs/api/actions)
- [Jest Documentation](https://jestjs.io/)
- [React Native Testing](https://reactnative.dev/docs/testing-overview)

## Support

For issues or questions:

1. Check the [Detox Troubleshooting Guide](https://wix.github.io/Detox/docs/introduction/troubleshooting)
2. Review GitHub Actions logs for CI failures
3. Open an issue in the repository with test logs and screenshots
