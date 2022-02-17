export const TotalTime = 2 * 60 * 1000;

const preparedOptions = (correct_answer, incorrect_answers) => {
    let options = [];
    const numOptions = incorrect_answers.length + 1;
    const correctAnswerIndex = Math.floor(Math.random() * numOptions);
  
    let incorrectCounter = 0;
    while (options.length < numOptions) {
      if (options.length === correctAnswerIndex) {
        options.push(correct_answer);
      } else {
        options.push(incorrect_answers[incorrectCounter]);
        incorrectCounter++;
      }
    }
    return options;
  };
  
  export  const getTimeString = (millis) => {
    const secs = millis / 1000;
    const mins = parseInt(secs / 60);
    const seconds = parseInt(secs) % 60;
    return mins > 0
      ? (mins < 10 ? "0" : "") + mins + ":" + seconds
      : "00:" + (seconds < 10 ? "0" : "") + seconds;
  };

  
  export const reducer = (state, action) => {
    if (action.type === "SET_QUESTIONS") {
      const opts = preparedOptions(
        action.questions[state.currentQuestionIndex].correct_answer,
        action.questions[state.currentQuestionIndex].incorrect_answers
      );
      return { ...state, questions: action.questions, options: opts };
    }
  
    if (action.type === "START_QUIZ")
      return {
        ...state,
        isStarted: true,
        currentQuestionIndex: 0,
        remainingTime: TotalTime,
      };
  
    if (action.type === "USER_ANSWER") {
      return { ...state, userAnswer: action.userAnswer };
    }
  
    if (action.type === "NEXT_QUESTION") {
      let correctCount = state.correctCount;
      let wasCorrect = false;
      if (
        state.questions[state.currentQuestionIndex].correct_answer ===
        state.userAnswer
      ){
        correctCount = state.correctCount + 1;
        wasCorrect = true;
      }
      const isLastQuestion =
        state.currentQuestionIndex === state.questions.length - 1 ? true : false;
      if (isLastQuestion) return { ...state, correctCount, isFinished: true, wasCorrect };
  
      const opts = preparedOptions(
        state.questions[state.currentQuestionIndex + 1].correct_answer,
        state.questions[state.currentQuestionIndex + 1].incorrect_answers
      );
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        correctCount,
        options: opts,
        wasCorrect
      };
    }
  
    if (action.type === "DECREMENT_TIME") {
      if (state.remainingTime <= 0) {
        return { ...state, isFinished: true, remainingTime: 0 };
      }
  
      return { ...state, remainingTime: state.remainingTime - 1000 };
    }
  
    if (action.type === "END_QUIZ") {
      return { ...state, isFinished: true };
    }
  
    return state;
  };
  