// Mock @shopify/react-native-skia
jest.mock('@shopify/react-native-skia', () => ({
  Canvas: 'Canvas',
  Circle: 'Circle',
  Path: 'Path',
  Skia: {
    Path: {
      Make: jest.fn(() => ({
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        cubicTo: jest.fn(),
        addRRect: jest.fn(),
      })),
    },
  },
  Text: 'Text',
  matchFont: jest.fn(() => ({})),
  Group: 'Group',
  RoundedRect: 'RoundedRect',
  useFont: jest.fn(() => null),
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: 'GestureHandlerRootView',
  GestureDetector: 'GestureDetector',
  Gesture: {
    Pan: jest.fn(() => ({
      onBegin: jest.fn().mockReturnThis(),
      onStart: jest.fn().mockReturnThis(),
      onUpdate: jest.fn().mockReturnThis(),
      onEnd: jest.fn().mockReturnThis(),
      onFinalize: jest.fn().mockReturnThis(),
    })),
  },
}));

// Silence console warnings during tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
