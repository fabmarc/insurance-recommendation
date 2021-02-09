import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import Survey from '..';

jest.mock('../../../components/Questionnaire', () => ({
  __esModule: true,
  default: () => 'Questionnaire',
}));

it('should render title and questionnaire component', () => {
  const { getByText } = render(<Survey />);

  expect(getByText('Please, answer some few questions...')).toBeInTheDocument();
  expect(getByText('Questionnaire')).toBeInTheDocument();
});
