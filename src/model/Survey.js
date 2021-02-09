import { reduce } from 'lodash';
import http from "../utils/request";

const allowedParams = [
  'firstName',
  'address',
  'occupation',
  'numberOfChildren',
  'email',
];

function mapToApi(answers) {
  return reduce(allowedParams, (accum, questionCode) => {
    if (
      questionCode === 'numberOfChildren' &&
      !answers?.['haveChildren']?.answerValue
    ) {
      accum[questionCode] = 0;
      return accum;
    }
    accum[questionCode] = answers?.[questionCode]?.answerValue;
    return accum;
  }, {});
}

export default class Survey {
  static saveAnswers = async answers => {
    const { data } = await http.post('/user', mapToApi(answers));
    return data;
  }
}
