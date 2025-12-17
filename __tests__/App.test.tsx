import React from 'react';
import {render} from '@testing-library/react-native';
import App from '../src/App';

describe('App', () => {
  it('renders correctly', () => {
    const {toJSON} = render(<App />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders the complete application', () => {
    const tree = render(<App />);
    expect(tree).toBeTruthy();
  });
});
