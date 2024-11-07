import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../app/index';

test('renders the Get Started button', () => {
  const { getByText } = render(<App />);
  expect(getByText('Get Started')).toBeTruthy();
});
