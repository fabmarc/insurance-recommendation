import React, { useState } from 'react';
import { useHistory } from "react-router";
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { head, isEmpty } from 'lodash';
import questionsConfig from '../../model/questionsConfig';
import { isBlank } from '../../utils';
import Question from '../Question';

import { Wrapper, Content, Body } from '..';

const Footer = styled.div`
`;

const Button = styled.button`
  padding: 8px 16px;
`;

function Questionnaire(props) {
  const { questions, answers: responses, onAnswersChange } = props;

  const history = useHistory();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState(responses);

  const handleAnswerChange = (questionCode, answerOption) => {
    const { value: answerValue, answerError, nextQuestion } = answerOption;
    setAnswers(prevAnswers => {
      const newAnswers = {
        ...prevAnswers,
        [questionCode]: {
          nextQuestion,
          answerError,
          answerValue,
        },
      };
      if (typeof onAnswersChange === 'function') {
        onAnswersChange(newAnswers);
      }
      return newAnswers;
    });
  }

  const currentQuestion = questions?.[stepIndex];
  const currentAnswer = answers?.[currentQuestion?.code];

  const handleNextClick = async () => {
    if (isEmpty(questions)) return;

    const { validationSchema } = questionsConfig[currentQuestion.code];
    if (validationSchema) {
      const awswerOption = {
        value: !isBlank(currentAnswer?.answerValue)
          ? currentAnswer.answerValue
          : undefined
      };
      try {
        currentAnswer.value = await validationSchema.validate(awswerOption);
        handleAnswerChange(currentQuestion.code, currentAnswer);
      } catch (error) {
        currentAnswer.answerError = head(error.errors);
        handleAnswerChange(currentQuestion.code, currentAnswer);
        return;
      }
    }
    if (stepIndex === questions.length - 1) {
      history.push('/recommendation');
      return;
    }
    setStepIndex(resolveNextStepIndex());
  }

  function resolveNextQuestion() {
    const currentQuestion = questions[stepIndex];
    let { nextQuestion } = answers[currentQuestion.code];
    if (!nextQuestion) nextQuestion = currentQuestion.nextQuestion;
    return nextQuestion;
  }

  function resolveNextStepIndex() {
    let nextStepIndex = -1;
    const nextQuestion = resolveNextQuestion()
    if (nextQuestion) nextStepIndex =
      questions.findIndex(question => question.code === nextQuestion)
    if (nextStepIndex === -1) nextStepIndex = stepIndex + 1;
    return nextStepIndex;
  }

  return (
    <Wrapper>
      <Content>
        <Body data-testid="questionnaire-body">
          {!isEmpty(questions) &&
            <Question
              {...currentAnswer}
              {...currentQuestion}
              onAnswerChange={handleAnswerChange}
            />
          }
        </Body>
        <Footer>
          <Button
            disabled={isBlank(currentAnswer?.answerValue)}
            onClick={handleNextClick}
          >
            Next
          </Button>
        </Footer>
      </Content>
    </Wrapper>
  );
}

Questionnaire.propTypes = {
  answers: PropTypes.object.isRequired,
  questions: PropTypes.array.isRequired,
  onAnswersChange: PropTypes.func,
};

export default Questionnaire;
