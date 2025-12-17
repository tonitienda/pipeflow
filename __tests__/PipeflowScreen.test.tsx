import React from 'react';
import {render} from '@testing-library/react-native';
import PipeflowScreen from '../src/screens/PipeflowScreen';

describe('PipeflowScreen', () => {
  it('renders the complete screen correctly', () => {
    const {toJSON} = render(<PipeflowScreen />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders level 1 (simple multiplication)', () => {
    const {getByText, toJSON} = render(<PipeflowScreen />);

    // Verify level UI elements are present
    expect(getByText('Level 1')).toBeTruthy();
    expect(getByText('Next →')).toBeTruthy();

    // Take snapshot
    expect(toJSON()).toMatchSnapshot('level-1');
  });
  it('renders the game canvas with nodes and connections', () => {
    const {toJSON} = render(<PipeflowScreen />);

    // The Canvas component should be rendered
    const tree = toJSON();
    expect(tree).toBeTruthy();

    // Take snapshot of the complete screen including canvas
    expect(tree).toMatchSnapshot('complete-game-screen');
  });
  it('renders component tray with draggable components', () => {
    const {toJSON} = render(<PipeflowScreen />);

    // Take snapshot showing the component tray at the bottom
    expect(toJSON()).toMatchSnapshot('component-tray');
  });
});
