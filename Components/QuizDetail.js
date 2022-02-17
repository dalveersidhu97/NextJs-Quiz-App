import { Fragment, useEffect, useReducer, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Card from "../UI/Card";
import useHttp from "../hooks/use-http";

import {reducer, getTimeString, TotalTime} from '../lib/Quiz';
import { useDispatch } from "react-redux";
import { addResult, clearResult } from "../store/QuizResultSlice";

var quizTimer = false;
const initialState = {
    questions: [],
    options: [],
    isStarted: false,
    isFinished: false,
    remainingTime: false,
    currentQuestionIndex: 0,
    userAnswer: false,
    correctCount: 0,
    wasCorrect: false
  };

const QuizDetaul = () => {
  const { catId } = useParams();
  const dispatchResult = useDispatch();
  const [showFeedback, setShowFeedback] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    questions,
    options,
    isStarted,
    isFinished,
    remainingTime,
    currentQuestionIndex,
    userAnswer,
    correctCount,
    wasCorrect
  } = { ...state };

  const { sendRequest, data, isLoading, error } = useHttp(
    "https://opentdb.com/api.php?amount=10&encode=base64&category=" +
      catId +
      "&difficulty=medium&type=multiple"
  );

  const isLastQuestion =
    currentQuestionIndex === questions.length - 1 ? true : false;

  let category = "";

  if (!isLoading && !error) {
    category = atob(data.results[0].category).split(":")[1] || atob(data.results[0].category);
  }

  const radioChangeHandler = (event) => {
    dispatch({ type: "USER_ANSWER", userAnswer: event.target.value });
  };

  const answerSubmitHandler = () => {
    dispatchResult(addResult({question: questions[currentQuestionIndex].question, correctAnswer: questions[currentQuestionIndex].correct_answer, userAnswer, options}));
    dispatch({ type: "NEXT_QUESTION" });
  };

  const startQuizHandler = () => {
    dispatch({ type: "SET_QUESTIONS", questions: data.results });
    dispatch({ type: "START_QUIZ" });
  };

  useEffect(() => {
    dispatchResult(clearResult())
    sendRequest();
  }, [sendRequest, dispatchResult]);

  useEffect(() => {
    if (!isFinished && isStarted) {
      quizTimer = setInterval(() => {
        dispatch({ type: "DECREMENT_TIME" });
      }, 1000);
    }
    if (isFinished) {
      clearInterval(quizTimer);
      dispatch({ type: "END_QUIZ" });
    }
    return () => {
      clearInterval(quizTimer);
    };
  }, [isFinished, isStarted]);

  useEffect(()=> {
    let feedBackTimer;
    if(currentQuestionIndex>0){
        setShowFeedback(true);
        feedBackTimer = setTimeout(()=> {setShowFeedback(false)}, 700);
    }
    return ()=> {
        if(feedBackTimer) clearTimeout(feedBackTimer);
    }
  },[currentQuestionIndex])
  return (
    <div className="w3-container">
      <br></br>

      {!isStarted && (
        <Card>
          <h2 className="w3-margin w3-padding">Quiz detail</h2>
          <h2 className="w3-margin w3-padding">{category} Category</h2>
          <h4 className="w3-margin w3-padding">Number of questions: {questions.length}</h4>
          <h4 className="w3-margin w3-padding">Time: {getTimeString(TotalTime)}</h4>
          <button className="w3-margin w3-padding" onClick={startQuizHandler}>Start Quiz</button>
          <br></br>
          <br></br>
        </Card>
      )}

      {isStarted && remainingTime > 0 && (
        <div className="w3-center">
          <h1>Time remaining: {getTimeString(remainingTime)}</h1>
        </div>
      )}
      {isFinished && remainingTime === 0 && (
        <div className="w3-center">
          <h1>Time Over</h1>
        </div>
      )}

      {isStarted && !isFinished && (
        <div className="w3-margin w3-padding">
          <h3>{`Question ${currentQuestionIndex + 1}:  ${atob(
            questions[currentQuestionIndex].question
          )}`}</h3>
          <div className="w3-margin w3-padding" onChange={radioChangeHandler}>
            {options.map((option, index) => (
              <p key={option}>
                <input className="w3-padding w3-margin" type="radio" name="option" value={option} />
                <label htmlFor="option">{atob(option)}</label>
              </p>
            ))}
            <button className="w3-margin w3-padding w3-button w3-round w3-black" onClick={answerSubmitHandler}>
              {isLastQuestion ? "Finish quiz" : "Next question"}
            </button>

            {showFeedback && (wasCorrect?<span className="w3-green w3-round w3-padding">Correct Asnwer!</span>:<span className="w3-red w3-padding w3-round w3-padding">Incorrect Answer!</span>)}
            
            <h4>
              {correctCount} correct out of {questions.length}
            </h4>
          </div>
        </div>
      )}

      {isFinished && (
        <Fragment>
          <div className="w3-center">
            <h2 className="w3-margin w3-padding">Result</h2>
            <h3 className="w3-margin w3-padding">
              {correctCount} correct out of {questions.length}
            </h3>
            <Link to={"/home"}>
                <Link to={'/quiz/results'}>See results</Link>
              <button className="w3-margin w3-padding w3-button w3-round w3-black">Take another quiz</button>
            </Link>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default QuizDetaul;
