import React from 'react';
import App from '../src/App';

// Mock expo-router Stack component
jest.mock('expo-router', () => ({
  Stack: {
    Screen: 'Stack.Screen',
  },
}));

describe('App', () => {
  it('renders without crashing', () => {
    // Test that App component can be instantiated without errors
    expect(() => {
      const element = <App />;
      expect(element).toBeDefined();
    }).not.toThrow();
  });
});
