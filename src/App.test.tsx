import { render, screen } from '@testing-library/react';
import App from './App';

test('renders financial interface service', () => {
  render(<App />);
  const titleElement = screen.getByText(/Financial Interface Service/i);
  expect(titleElement).toBeInTheDocument();
});
