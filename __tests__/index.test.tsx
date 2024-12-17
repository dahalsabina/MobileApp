import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from '../app/index';
import { useRouter } from "expo-router";

// Mock the router to test navigation
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe('App Component', () => {
  it('renders the Get Started button', () => {
    const { getByText } = render(<App />);
    expect(getByText('Get Started')).toBeTruthy();
  });

  it('renders the parachute icon', () => {
    const { getByTestId } = render(<App />);
    const parachuteIcon = getByTestId('parachute-icon');
    expect(parachuteIcon).toBeTruthy();
  });

  it('renders the world map icon', () => {
    const { getByTestId } = render(<App />);
    const worldMapIcon = getByTestId('world-map-icon');
    expect(worldMapIcon).toBeTruthy();
  });

  it('displays the title text', () => {
    const { getByText } = render(<App />);
    expect(getByText(/Explore the World/i)).toBeTruthy();
  });

  it('displays the subtitle text', () => {
    const { getByText } = render(<App />);
    expect(getByText(/Discover stories, insights, and events/i)).toBeTruthy();
  });

  it('navigates to the home page when the button is pressed', () => {
    const mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    const { getByText } = render(<App />);
    const button = getByText('Get Started');

    fireEvent.press(button);
    expect(mockRouter.push).toHaveBeenCalledWith('/register');
  });
});
