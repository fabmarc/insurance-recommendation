import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import questionsConfig from '../../model/questionsConfig';

const Box = styled.div`
  font-weight: ${props => (props.bold ? '600' : 'initial')};
  padding: ${props => (props.padding ? '8px 0' : 'initial')};
`;

export default function Question(props) {
  const {
    code,
    label,
    answerValue,
    answerError,
    answerOptions,
    onAnswerChange,
  } = props;

  const handleAnswerChange = (answerValue) => {
    if (typeof onAnswerChange === 'function') {
      onAnswerChange(code, answerValue);
    }
  }

  const { AnswerComponent } = questionsConfig[code];

  return (
    <Fragment>
      <Box padding bold>{label}</Box>
      <Box padding>
        <AnswerComponent
          value={answerValue}
          options={answerOptions}
          onChange={handleAnswerChange}
          error={answerError}
        />
      </Box>
    </Fragment>
  );
}

Question.propTypes = {
  code: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  answerValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  answerError: PropTypes.string,
  answerOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    label: PropTypes.oneOfType([PropTypes.string]),
  })),
  onAnswerChange: PropTypes.func,
};
