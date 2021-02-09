import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextField from '..';

const mockOnChange = jest.fn();

it('should render without value', () => {
  const { container } = render(<TextField />);

  expect(container.querySelector('input').value).toBe('');
});

it('should render with value', () => {
  const { container } = render(<TextField value="Hello" />);

  expect(container.querySelector('input').value).toBe('Hello');
});

it('should call onChange if value is changed', () => {
  const { container } = render(<TextField onChange={mockOnChange} />);
  const input = container.querySelector('input');

  expect(input.value).toBe('');
  userEvent.type(input, 'Test');

  expect(input.value).toBe('Test');
  expect(mockOnChange.mock.calls.length).toBe(4);
});

it('should display error message', () => {
  const { getByText, container } = render(<TextField error="Test error" />);

  expect(container.querySelector('input')).toBeInTheDocument();
  expect(getByText('Test error')).toBeInTheDocument();
});
