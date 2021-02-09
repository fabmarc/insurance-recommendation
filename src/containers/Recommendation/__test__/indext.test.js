import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, waitFor, within } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { capitalize, lowerCase } from 'lodash';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MOCK_RECOMMENDATION_SUCCESS } from './mockRecommendationTestData';
import Recommendation from '..';

const mock = new MockAdapter(axios);

jest.mock('../../../utils/surveyStorage', () => ({
  __esModule: true,
  getAnswers: () => ({
    firstName: { answerValue: 'testName' },
    address: { answerValue: 'any' },
  }),
}));

afterEach(() => {
  mock.reset();
});

const postResp = { jwt: 'anyToken' };

it('should render without crash for empty response value', async () => {
  mock.onPost('/user').reply(200, postResp);
  mock.onGet('/recommendation').reply(200, []);
  const { getByTestId } = render(
    <Router>
      <Recommendation />
    </Router>,
  );

  await waitFor(() => {
    expect(getByTestId('recommendation-body')).toBeEmptyDOMElement();
  });
});

it('should render with the response items for successful response', async () => {
  mock.onPost('/user').reply(200, postResp);
  mock.onGet('/recommendation').reply(200, MOCK_RECOMMENDATION_SUCCESS);
  const { getByTestId } = render(
    <Router>
      <Recommendation />
    </Router>,
  );

  await waitFor(() => {
    MOCK_RECOMMENDATION_SUCCESS.forEach((item) => {
      const renderedItem = getByTestId(
        `${item.type}-${item.price.periodicity}`,
      );
      expect(
        within(renderedItem).getByText(capitalize(lowerCase(item.type))),
      ).toBeInTheDocument();
    });
  });
});

it('should render with correct error for 401 response', async () => {
  mock.onPost('/user').reply(200, postResp);
  mock.onGet('/recommendation').reply(401, {
    errors: { authorization: 'Authorization header was not provided' },
  });
  const { getByText } = render(
    <Router>
      <Recommendation />
    </Router>,
  );

  await waitFor(() => {
    expect(
      getByText('authorization: Authorization header was not provided'),
    ).toBeInTheDocument();
  });
});

it('should render with correct error for 422 response', async () => {
  mock.onPost('/user').reply(200, postResp);
  mock
    .onGet('/recommendation')
    .reply(422, { errors: { email: ['Not a valid email address'] } });
  const { getByText } = render(
    <Router>
      <Recommendation />
    </Router>,
  );

  await waitFor(() => {
    expect(getByText('email: Not a valid email address')).toBeInTheDocument();
  });
});

it('should render unexpected error for 500 response', async () => {
  mock.onPost('/user').reply(200, postResp);
  mock.onGet('/recommendation').reply(500);
  const { getByText } = render(
    <Router>
      <Recommendation />
    </Router>,
  );

  await waitFor(() => {
    expect(getByText('Server: Unexpected error')).toBeInTheDocument();
  });
});
