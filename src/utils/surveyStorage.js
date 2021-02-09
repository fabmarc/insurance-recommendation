const ANSWERS_STORAGE_KEY = 'Survey::Answers';

export function getAnswers() {
  const value = localStorage.getItem(ANSWERS_STORAGE_KEY);
  return value ? JSON.parse(value) : {};
}

export function setAnswers(answers) {
  localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(answers));
}
