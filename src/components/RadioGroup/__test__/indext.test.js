import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RadioGroup from '..';

it('should not crash for empty options', () => {
  const { getByTestId } = render(<RadioGroup name="Test" />);

  expect(getByTestId('radio-list')).toBeEmptyDOMElement();
});

it('should render all options without value', () => {
  const { getByLabelText } = render(
    <RadioGroup
      name="Test"
      options={[
        { label: 'option1', value: 'op1' },
        { label: 'option2', value: 'op2' },
      ]}
    />,
  );

  expect(getByLabelText('option1')).not.toBeChecked();
  expect(getByLabelText('option2')).not.toBeChecked();
});

it('should render with value', () => {
  const { getByLabelText } = render(
    <RadioGroup
      name="Test"
      value="op2"
      options={[
        { label: 'option1', value: 'op1' },
        { label: 'option2', value: 'op2' },
      ]}
    />,
  );

  expect(getByLabelText('option1')).not.toBeChecked();
  expect(getByLabelText('option2')).toBeChecked();
});

it('should call onChange if value is changed', () => {
  const mockOnChange = jest.fn();
  const { getByLabelText } = render(
    <RadioGroup
      name="Test"
      onChange={mockOnChange}
      options={[
        { label: 'option1', value: 'op1' },
        { label: 'option2', value: 'op2' },
      ]}
    />,
  );

  expect(getByLabelText('option1')).not.toBeChecked();
  userEvent.click(getByLabelText('option1'));

  expect(getByLabelText('option1')).toBeChecked();
  expect(getByLabelText('option2')).not.toBeChecked();
  expect(mockOnChange.mock.calls.length).toBe(1);
});

it('should display error message', () => {
  const { getByLabelText, getByText } = render(
    <RadioGroup
      name="test"
      options={[
        { label: 'option1', value: 'op1' },
        { label: 'option2', value: 'op2' },
      ]}
      error="Test error"
    />,
  );

  expect(getByLabelText('option1')).toBeInTheDocument();
  expect(getByLabelText('option2')).toBeInTheDocument();
  expect(getByText('Test error')).toBeInTheDocument();
});
