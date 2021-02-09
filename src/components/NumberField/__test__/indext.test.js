import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberField from '..'

const mockOnChange = jest.fn();

it('should render without value', () => {
  const { container } = render(<NumberField />);

  expect(container.querySelector('input').value).toBe('');
});

it('should render with value', () => {
  const { container } = render(<NumberField value="8" />);

  expect(container.querySelector('input').value).toBe('8');
});

it('should call onChange if value is changed', () => {
  const { container } = render(<NumberField onChange={mockOnChange} />);
  const input = container.querySelector('input');

  expect(input.value).toBe('');
  userEvent.type(input, '3')

  expect(input.value).toBe('3');
  expect(mockOnChange.mock.calls.length).toBe(1);
});

it('should not call onChange if typed value is not number', () => {
  const { container } = render(<NumberField onChange={mockOnChange} />);
  const input = container.querySelector('input');

  expect(input.value).toBe('');
  userEvent.type(input, 'ab')
  
  expect(input.value).toBe('');
  expect(mockOnChange.mock.calls.length).toBe(0);
});

it('should display error message', () => {
  const { getByText, container } = render(<NumberField error="Test error" />);

  expect(container.querySelector('input')).toBeInTheDocument;
  expect(getByText("Test error")).toBeInTheDocument;
});
