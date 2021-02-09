import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Questionnaire from '..';

const mockHistoryPush = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

afterEach(cleanup);

it('should render without crash for empty questions', () => {
  const { getByTestId, container } = render(
    <Questionnaire questions={[]} answers={{}} />,
  );

  expect(getByTestId('questionnaire-body')).toBeEmptyDOMElement();
  expect(container.querySelector('button')).toBeDisabled();
});

it('should display first question without answer for empty answers', () => {
  const { getByText, container } = render(
    <Questionnaire
      questions={[
        {
          id: 1,
          code: 'firstName',
          label: 'What is your first name?',
        },
        {
          id: 2,
          code: 'address',
          label: 'What is your address?',
        },
      ]}
      answers={{}}
    />,
  );

  expect(getByText('What is your first name?')).toBeInTheDocument();
  expect(container.querySelector('input').value).toBe('');
  expect(container.querySelector('button')).toBeDisabled();
});

it('should display question with answer for non-empty answers', () => {
  const { getByText, container } = render(
    <Questionnaire
      questions={[
        {
          id: 1,
          code: 'firstName',
          label: 'What is your first name?',
        },
      ]}
      answers={{ firstName: { answerValue: 'testName' } }}
    />,
  );

  expect(getByText('What is your first name?')).toBeInTheDocument();
  expect(container.querySelector('input').value).toBe('testName');
  expect(container.querySelector('button')).toBeEnabled();
});

it('should display first question and move to next question by clicking NEXT', async () => {
  //Given the component with two questions on props, displaying the first one
  const { getByText, container } = render(
    <Questionnaire
      questions={[
        {
          id: 1,
          code: 'firstName',
          label: 'What is your first name?',
        },
        {
          id: 2,
          code: 'address',
          label: 'What is your address?',
        },
      ]}
      answers={{}}
    />,
  );

  expect(getByText('What is your first name?')).toBeInTheDocument();
  expect(container.querySelector('input').value).toBe('');
  expect(container.querySelector('button')).toBeDisabled();

  //When the answer is filled and the next button is clicked
  const input = container.querySelector('input');
  userEvent.type(input, 'myAnswer');
  const button = container.querySelector('button');

  expect(button).toBeEnabled();
  userEvent.click(button);

  //Then it should move to the next question
  await waitFor(() => {
    expect(getByText('What is your address?')).toBeInTheDocument();
  });
});

it('should push to history by clicking NEXT on last question', async () => {
  //Given it's the last question
  const { container } = render(
    <Questionnaire
      questions={[
        {
          id: 1,
          code: 'firstName',
          label: 'What is your first name?',
        },
      ]}
      answers={{}}
    />,
  );

  //When the user fills the answer and clicks next
  const input = container.querySelector('input');
  userEvent.type(input, 'testAnswer');
  const button = container.querySelector('button');

  expect(button).toBeEnabled();
  userEvent.click(button);

  //Then it should call history.push
  await waitFor(() => {
    expect(mockHistoryPush.mock.calls.length).toBe(1);
    expect(mockHistoryPush.mock.calls[0][0]).toBe('/recommendation');
  });
});

it('should display the next question according to the answer by clicking NEXT', async () => {
  //Given the component with three questions on props, displaying the first one
  const { getByText, container } = render(
    <Questionnaire
      questions={[
        {
          id: 1,
          code: 'haveChildren',
          label: 'Do you have any children?',
          answerOptions: [
            {
              value: true,
              label: 'Yes',
            },
            {
              value: false,
              label: 'No',
              nextQuestion: 'email',
            },
          ],
        },
        {
          id: 2,
          code: 'numberOfChildren',
          label: 'How many children do you have?',
        },
        {
          id: 3,
          code: 'email',
          label: 'What is your email?',
        },
      ]}
      answers={{}}
    />,
  );

  expect(getByText('Do you have any children?')).toBeInTheDocument();
  expect(container.querySelector('button')).toBeDisabled();

  //When the answer is selected
  const radio = getByText('No');
  userEvent.click(radio);
  const button = container.querySelector('button');

  expect(button).toBeEnabled();
  userEvent.click(button);

  //Then it should move to the email question which was referred as nextQuestion by the selected answer
  await waitFor(() => {
    expect(getByText('What is your email?')).toBeInTheDocument();
  });
});

it('should display error message for invalid value by clicking NEXT', async () => {
  //Given the component with two questions on props, displaying the first one
  const { getByText, container } = render(
    <Questionnaire
      questions={[
        {
          id: 1,
          code: 'email',
          label: 'What is your email?',
        },
        {
          id: 2,
          code: 'numberOfChildren',
          label: 'How many children do you have?',
        },
      ]}
      answers={{}}
    />,
  );

  expect(getByText('What is your email?')).toBeInTheDocument();

  //When the answer is filled with invalid value and the next button is clicked
  const input = container.querySelector('input');
  userEvent.type(input, 'invalidEmail');
  const button = container.querySelector('button');

  expect(button).toBeEnabled();
  userEvent.click(button);

  //Then it should remain on the same question and display the error message
  await waitFor(() => {
    expect(getByText('What is your email?')).toBeInTheDocument();
    expect(getByText('Must be a valid email')).toBeInTheDocument();
  });
});
