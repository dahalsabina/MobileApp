import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import HomePage from '../app/(tabs)/homePage';



import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks(); // Enable fetch mocking globally

describe('HomePage Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('renders the header and welcome message correctly', () => {
    const { getByText } = render(<HomePage />);

    expect(getByText('Welcome to the Feed')).toBeTruthy();
    expect(getByText('Explore discussions from everyone!')).toBeTruthy();
    expect(getByText('Recent Discussions')).toBeTruthy();
  });

  test('fetches and displays discussions', async () => {
    // Mock API response
    fetchMock.mockResponseOnce(
      JSON.stringify([
        {
          discussion_id: '1',
          title: 'Test Discussion',
          body: 'This is a test body',
        },
      ])
    );

    const { getByText, queryByTestId } = render(<HomePage />);

    // // Verify the loading spinner is displayed
    // expect(queryByTestId('loading-indicator')).toBeTruthy();

    // Wait for the discussions to load
    await waitFor(() => {
      expect(getByText('Test Discussion')).toBeTruthy();
      expect(getByText('This is a test body')).toBeTruthy();
    });

    // Verify spinner disappears
    expect(queryByTestId('loading-indicator')).toBeFalsy();
  });

  test('handles API error gracefully', async () => {
    // Mock API failure
    fetchMock.mockReject(new Error('Failed to fetch discussions'));

    const { getByText, queryByTestId } = render(<HomePage />);

    // Verify the loading spinner is displayed
    expect(queryByTestId('loading-indicator')).toBeTruthy();

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(getByText('Failed to fetch discussions')).toBeTruthy();
    });

    // Verify spinner disappears
    expect(queryByTestId('loading-indicator')).toBeFalsy();
  });

  test('renders a clickable discussion title', async () => {
    // Mock API response
    fetchMock.mockResponseOnce(
      JSON.stringify([
        {
          discussion_id: '1',
          title: 'Test Discussion',
          body: 'This is a test body',
        },
      ])
    );

    const { getByText } = render(<HomePage />);

    

    // const discussionTitle = getByText('Test Discussion');
    // expect(discussionTitle).toBeTruthy();

    // Simulate navigation by clicking the title
    // fireEvent.press(discussionTitle);
    // Ideally, you would mock navigation behavior here and verify the navigation route.
  });

  test('displays multiple discussions', async () => {
    // Mock API response with multiple discussions
    fetchMock.mockResponseOnce(
      JSON.stringify([
        { discussion_id: '1', title: 'Discussion 1', body: 'Body 1' },
        { discussion_id: '2', title: 'Discussion 2', body: 'Body 2' },
      ])
    );

    const { getByText } = render(<HomePage />);

    await waitFor(() => {
      expect(getByText('Discussion 1')).toBeTruthy();
      expect(getByText('Body 1')).toBeTruthy();
      expect(getByText('Discussion 2')).toBeTruthy();
      expect(getByText('Body 2')).toBeTruthy();
    });
  });
});
