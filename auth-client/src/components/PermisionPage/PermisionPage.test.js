import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PermisionPage from './PermisionPage';

describe('<PermisionPage />', () => {
  test('it should mount', () => {
    render(<PermisionPage />);
    
    const permisionPage = screen.getByTestId('PermisionPage');

    expect(permisionPage).toBeInTheDocument();
  });
});