import React, { useRef } from 'react';
import questions from '../../model/questions.json';
import Questionnaire from '../../components/Questionnaire';
import { getAnswers, setAnswers } from '../../utils/surveyStorage';
import { Root, Title } from '../../components';

export default function Survey() {
  const answers = useRef(getAnswers()).current;

  return (
    <Root>
      <Title>Please, answer some few questions...</Title>
      <Questionnaire
        answers={answers}
        questions={questions}
        onAnswersChange={setAnswers}
      />
    </Root>
  );
}
