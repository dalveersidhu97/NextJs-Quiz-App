import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Fragment } from "react/cjs/react.production.min";
import Card from "../../Components/UI/Card";

const QuizResult = () => {
  const quizResults = useSelector((state) => state.quizResult.results);
  const router = useRouter();

  useEffect(() => {
    if (!quizResults || quizResults.length === 0) 
      router.push('/');
  }, [quizResults, router]);

  return (
    <div className="w3-margin w3-padding">
      <Link href={"/"} passHref>
        <button className="w3-margin w3-padding w3-button w3-round w3-black">Take another quiz</button>
      </Link>
      {quizResults.map((result, index) => (
        <Fragment key={index}>
          <br></br>
          <Card>
            <h3 style={{ textAlign: "left" }}>{`Question ${index}:  ${atob(
              result.question
            )}`}</h3>
            <div className="w3-margin w3-padding">
              {result.options.map((option, index) => (
                <h4 key={option}>
                  <input
                    className="w3-padding w3-margin"
                    type="radio"
                    name={option}
                    value={option === result.userAnswer?'true':'false'}
                    checked={option === result.userAnswer?true:false}
                    disabled
                  />
                  <label
                    style={{
                      width: "90%",
                      display: "inline-block",
                      textAlign: "left",
                    }}
                    htmlFor="option"
                  >
                    {atob(option)}{" "}
                    {option === result.correctAnswer ? (
                      <span className="w3-green w3-round w3-padding">
                        Correct
                      </span>
                    ) : (
                      ""
                    )}{" "}
                    {option === result.userAnswer &&
                    option !== result.correctAnswer ? (
                      <span className="w3-red w3-round w3-padding">
                        Incorrect
                      </span>
                    ) : (
                      ""
                    )}
                  </label>
                </h4>
              ))}
            </div>
          </Card>
        </Fragment>
      ))}
      <Link href={"/"} passHref>
        <button className="w3-margin w3-padding w3-button w3-round w3-black">Take another quiz</button>
      </Link>
    </div>
  );
};

export default QuizResult;
