// Mock for react-native-svg
jest.mock('react-native-svg', () => {
  const React = require('react');
  return {
    Svg: ({children, ...props}: any) => React.createElement('Svg', props, children),
    Path: (props: any) => React.createElement('Path', props),
    Circle: (props: any) => React.createElement('Circle', props),
    Line: (props: any) => React.createElement('Line', props),
    G: ({children, ...props}: any) => React.createElement('G', props, children),
  };
});

// Mock for @shopify/react-native-skia
jest.mock('@shopify/react-native-skia', () => ({
  Canvas: 'Canvas',
  Circle: 'Circle',
  Text: 'Text',
  Group: 'Group',
  RoundedRect: 'RoundedRect',
  Path: 'Path',
  Skia: {
    Path: {
      Make: jest.fn(() => ({
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        close: jest.fn(),
      })),
    },
  },
  matchFont: jest.fn(() => ({})),
  useFont: jest.fn(() => null),
}));

// Mock for react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: 'GestureHandlerRootView',
  GestureDetector: 'GestureDetector',
  Gesture: {
    Pan: jest.fn(() => ({
      onBegin: jest.fn().mockReturnThis(),
      onUpdate: jest.fn().mockReturnThis(),
      onEnd: jest.fn().mockReturnThis(),
    })),
  },
}));

// Mock for react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});








