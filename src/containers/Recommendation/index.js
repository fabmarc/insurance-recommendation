import React, { useEffect, useState } from 'react';
import { capitalize, flatMap, lowerCase, map } from 'lodash';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { locale, currency } from '../../config';
import { formatCurrency } from '../../utils';
import { getAnswers } from '../../utils/surveyStorage';
import Recommend from '../../model/Recommendation';
import Survey from '../../model/Survey';

import { Root, Wrapper, Content, Body, Title } from '../../components';

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid ${(props) => (props.error ? '#F00' : '')};
  background: ${(props) => (props.error ? '#FFD7D7' : 'initial')};
  padding: 16px;
  margin-bottom: 8px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const Overlay = styled.div`
  position: absolute;
  display: flex;
  width: inherit;
  height: inherit;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  font-weight: 600;
  color: #028004;
`;

const Info = styled.div``;

const Footer = styled.div``;

function resolveInsuranceTypeLabel(type) {
  return capitalize(lowerCase(type));
}

function resolvePeriodicityLabel(periodicity) {
  return lowerCase(periodicity);
}

export default function Recommendation() {
  const [recommendations, setRecommendations] = useState();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState();

  function handleRequestError(error) {
    if (error.response.status === 500) {
      setErrors([{ source: 'Server', errorMessage: 'Unexpected error' }]);
      return;
    }
    if (error.response.status === 422) {
      // 422 error format:
      // { numberOfChildren: ["Not a valid integer."],
      //   email: ["Not a valid email address.", "Other error message"] }
      const errors = flatMap(
        map(error.response.data?.errors, (errors, source) =>
          map(errors, (errorMessage) => ({ source, errorMessage })),
        ),
      );
      setErrors(
        errors || [{ source: 'Server', errorMessage: 'Unexpected error' }],
      );
      return;
    }
    // other errors format, like 401:
    // { authorization: "Authorization header was not provided" }
    const errors = map(error.response.data?.errors, (errorMessage, source) => ({
      source,
      errorMessage,
    }));
    setErrors(
      errors || [{ source: 'Server', errorMessage: 'Unexpected error' }],
    );
  }

  const loadPage = async () => {
    try {
      setErrors(null);
      setLoading(true);
      const { jwt: token } = await Survey.saveAnswers(getAnswers());
      const data = await Recommend.loadRecommendations(token);
      setRecommendations(data);
    } catch (error) {
      setRecommendations(null);
      handleRequestError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, []);

  return (
    <Root>
      <Overlay>{loading && 'Loading...'}</Overlay>
      <Title>We got your Recommendations</Title>
      <Wrapper>
        <Content>
          <Body data-testid="recommendation-body">
            {map(errors, ({ errorMessage, source }) => (
              <Card key={errorMessage} error>
                {`${source}: ${errorMessage}`}
              </Card>
            ))}
            {map(
              recommendations,
              ({ type, price: { periodicity, amount } }) => (
                <Card
                  key={`${type}-${periodicity}`}
                  data-testid={`${type}-${periodicity}`}
                >
                  <Info>{resolveInsuranceTypeLabel(type)}</Info>
                  <Info>{`${formatCurrency(
                    amount,
                    currency,
                    locale,
                  )} per ${resolvePeriodicityLabel(periodicity)}`}</Info>
                </Card>
              ),
            )}
          </Body>
          <Footer>
            <Link to="/">Home</Link>
          </Footer>
        </Content>
      </Wrapper>
    </Root>
  );
}
