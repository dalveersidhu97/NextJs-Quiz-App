import { sendHttpRequest } from "../../lib/HttpRequest";
import Card from "../../Components/UI/Card";
import { getTimeString, TotalTime } from "../../lib/Quiz";
import { reducer } from "../../lib/Quiz";
import { useEffect, useReducer, useState } from "react";
import { Fragment } from "react/cjs/react.production.min";
import Link from "next/link";
import { useDispatch } from "react-redux";

export async function getServerSideProps(context) {
  const { data, error } = await sendHttpRequest(
    "https://opentdb.com/api.php?amount=10&encode=base64&category=" +
      context.query.categoryId +
      "&difficulty=medium&type=multiple"
  );

  return {
    props: { data, error },
  };
}

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
  wasCorrect: false,
};

export default function QuizDetailPage(props) {
  const { data } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showFeedback, setShowFeedback] = useState(false);
  //const dispatchResult = useDispatch();

  const {
    questions,
    options,
    isStarted,
    isFinished,
    remainingTime,
    currentQuestionIndex,
    userAnswer,
    correctCount,
    wasCorrect,
  } = { ...state };

  //   useEffect(() => {
  //     dispatchResult(clearResult());
  //   }, [dispatchResult]);

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

  useEffect(() => {
    let feedBackTimer;
    if (currentQuestionIndex > 0) {
      setShowFeedback(true);
      feedBackTimer = setTimeout(() => {
        setShowFeedback(false);
      }, 700);
    }
    return () => {
      if (feedBackTimer) clearTimeout(feedBackTimer);
    };
  }, [currentQuestionIndex]);

  if (props.error)
    return (
      <div>
        <h1>{error.message}</h1>
      </div>
    );
  const category =
    atob(data.results[0].category).split(":")[1] ||
    atob(data.results[0].category);

  /////

  const isLastQuestion =
    currentQuestionIndex === questions.length - 1 ? true : false;

  const radioChangeHandler = (event) => {
    dispatch({ type: "USER_ANSWER", userAnswer: event.target.value });
  };

  const answerSubmitHandler = () => {
    // dispatchResult(
    //   addResult({
    //     question: questions[currentQuestionIndex].question,
    //     correctAnswer: questions[currentQuestionIndex].correct_answer,
    //     userAnswer,
    //     options,
    //   })
    // );
    dispatch({ type: "NEXT_QUESTION" });
  };

  const startQuizHandler = () => {
    dispatch({ type: "SET_QUESTIONS", questions: data.results });
    dispatch({ type: "START_QUIZ" });
  };

  return (
    <div className="w3-container">
      
      {!isStarted && (
        <Card>
          <h2 className="w3-margin w3-padding">Quiz detail</h2>
          <h2 className="w3-margin w3-padding">{category} Category</h2>
          <h4 className="w3-margin w3-padding">
            Number of questions: {data.results.length}
          </h4>
          <h4 className="w3-margin w3-padding">
            Time: {getTimeString(TotalTime)}
          </h4>
          <button className="w3-margin w3-padding" onClick={startQuizHandler}>
            Start Quiz
          </button>
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
                <input
                  className="w3-padding w3-margin"
                  type="radio"
                  name="option"
                  value={option}
                />
                <label htmlFor="option">{atob(option)}</label>
              </p>
            ))}
            <button
              className="w3-margin w3-padding w3-button w3-round w3-black"
              onClick={answerSubmitHandler}
            >
              {isLastQuestion ? "Finish quiz" : "Next question"}
            </button>

            {showFeedback &&
              (wasCorrect ? (
                <span className="w3-green w3-round w3-padding">
                  Correct Asnwer!
                </span>
              ) : (
                <span className="w3-red w3-padding w3-round w3-padding">
                  Incorrect Answer!
                </span>
              ))}

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

            <Link href={"/quiz/results"}>See results</Link>
            <Link href={"/"} passHref>
              <button className="w3-margin w3-padding w3-button w3-round w3-black">
                Take another quiz
              </button>
            </Link>
          </div>
        </Fragment>
      )}
    </div>
  );
}
