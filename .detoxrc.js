module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/pipeflow.app',
      build: 'xcodebuild -workspace ios/pipeflow.xcworkspace -scheme pipeflow -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 15',
      },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
  },
  artifacts: {
    rootDir: './e2e/screenshots',
    plugins: {
      screenshot: {
        enabled: true,
        shouldTakeAutomaticSnapshots: true,
        keepOnlyFailedTestsArtifacts: false,
        takeWhen: {
          testStart: false,
          testDone: true,
        },
      },
    },
  },
};
