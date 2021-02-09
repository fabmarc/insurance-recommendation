import React from 'react';
import { string, number, boolean, object } from 'yup';
import NumberField from '../components/NumberField';
import RadioGroup from '../components/RadioGroup';
import TextField from '../components/TextField';

const questionsConfig = {
  firstName: {
    AnswerComponent: props => <TextField {...props} />,
    validationSchema: object().shape({
      value: string().required('Required'),
    }),
  },
  address: {
    AnswerComponent: props => <TextField {...props} />,
    validationSchema: object().shape({
      value: string().required('Required'),
    }),
  },
  occupation: {
    AnswerComponent: props => <RadioGroup name="occupation" {...props} />,
    validationSchema: object().shape({
      value: string().required('Required'),
    }),
  },
  haveChildren: {
    AnswerComponent: props => <RadioGroup name="haveChildren" {...props} />,
    validationSchema: object().shape({
      value: boolean().required('Required'),
    }),
  },
  numberOfChildren: {
    AnswerComponent: props => <NumberField {...props} />,
    validationSchema: object().shape({
      value: number()
        .required('Required')
        .typeError('Must be a valid number')
        .integer('Must be a integer')
        .min(1, 'Must be greater than or equal to 1'),
    }),
  },
  email: {
    AnswerComponent: props => <TextField {...props} />,
    validationSchema: object().shape({
      value: string()
        .required('Required')
        .email('Must be a valid email'),
    }),
  },
};

export default questionsConfig;
