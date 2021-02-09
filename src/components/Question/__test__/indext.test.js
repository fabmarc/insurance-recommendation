import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import Question from '..';

jest.mock('../../TextField', () => ({
  __esModule: true,
  default: () => 'TextField',
}));

jest.mock('../../RadioGroup', () => ({
  __esModule: true,
  default: () => 'RadioGroup',
}));

jest.mock('../../NumberField', () => ({
  __esModule: true,
  default: () => 'NumberField',
}));

it('should display question label based on label props', () => {
  const { getByText } = render(
    <Question code="firstName" label="My question" />,
  );

  expect(getByText('My question')).toBeInTheDocument();
});

it('should display question with TextField if code matches textField on questionConfig', () => {
  const { getByText } = render(
    <Question code="firstName" label="Test question" />,
  );

  expect(getByText('TextField')).toBeInTheDocument();
});

it('should display question with RadioGroup if code matches RadioGroup on questionConfig', () => {
  const { getByText } = render(
    <Question code="occupation" label="Test question" />,
  );

  expect(getByText('RadioGroup')).toBeInTheDocument();
});

it('should display question with NumberField if code matches NumberField on questionConfig', () => {
  const { getByText } = render(
    <Question code="numberOfChildren" label="Test question" />,
  );

  expect(getByText('NumberField')).toBeInTheDocument();
});
