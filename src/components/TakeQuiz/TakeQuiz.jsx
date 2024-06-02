import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./TakeQuiz.module.css"; // Create a CSS module for styling

const TakeQuiz = () => {
  const { uniqueLink } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [timer, setTimer] = useState(null);
  const [timerActive, setTimerActive] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(
          `https://quizzie-server-h49m.onrender.com/quiz/take/${uniqueLink}`
        );
        setQuizData(response.data.quizData);
      } catch (error) {
        setError("Quiz not found");
      }
    };

    fetchQuizData();
  }, [uniqueLink]);

  useEffect(() => {
    if (
      quizData &&
      quizData.questions[currentQuestionIndex].type === "q&a" &&
      quizData.questions[currentQuestionIndex].timer > 0
    ) {
      setTimer(quizData.questions[currentQuestionIndex].timer);
      setTimerActive(true);
    }
  }, [quizData, currentQuestionIndex]);

  useEffect(() => {
    if (timer > 0) {
      const timerId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else if (timer === 0) {
      setTimerActive(false);
    }
  }, [timer]);

  const handleOptionClick = (questionId, optionId) => {
    if (timerActive) {
      setResponses((prevResponses) => ({
        ...prevResponses,
        [questionId]: optionId,
      }));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(
        quizData.questions[currentQuestionIndex + 1].type === "q&a"
          ? quizData.questions[currentQuestionIndex + 1].timer
          : null
      );
      setTimerActive(true);
    }
  };

  const handleSubmit = async () => {
    const answers = quizData.questions.map((question) => ({
      questionId: question._id,
      selectedOption: responses[question._id],
    }));

    try {
      const response = await axios.post(
        `https://quizzie-server-h49m.onrender.com/submit/${uniqueLink}`,
        { answers }
      );
      if (quizData.type === "q&a") {
        navigate("/thank-you", {
          state: {
            message: `Congrats, quiz is completed!`,
            data: response.data,
          },
        });
      } else {
        navigate("/thank-you", {
          state: { message: `Thank you for participating in the poll!` },
        });
      }
    } catch (error) {
      console.error("Error submitting quiz responses", error);
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!quizData) {
    return <div className={styles.Loading}><p>Loading...</p></div>;
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.wrapper}>
        <div className={styles.questionInfoWrapper}>
          <div className={styles.questionNumber}>
            {currentQuestionIndex + 1}/{quizData.questions.length}
          </div>
          {timer !== null && (
            <p>
              <span className={styles.timerRed}>{timer}s</span>
            </p>
          )}
        </div>
        <div className={styles.question}>
          <h2 className={styles.questionMainText}>{currentQuestion.questionText}</h2>
          <div className={styles.options}>
            {currentQuestion.options.map((option) => (
              <div
                key={option._id}
                className={`${styles.option} ${
                  responses[currentQuestion._id] === option._id
                    ? styles.selected
                    : ""
                } ${!timerActive ? styles.disabled : ""} ${option.optionType === "image" ? styles.onlyImageContainer : "" }`}
                onClick={() =>
                  handleOptionClick(currentQuestion._id, option._id)
                }
              >
                {option.optionType === "text" && <span className={styles.onlyText}>{option.text}</span>}
                {option.optionType === "image" && (
                  <img className={styles.onlyImage} src={option.imageUrl} alt={option.text} />
                )}
                {option.optionType === "text-image" && (
                  <>
                    <span>{option.text}</span>
                    <img src={option.imageUrl} alt={option.text} />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        {currentQuestionIndex < quizData.questions.length - 1 ? (
          <button className={styles.submitButton} onClick={handleNextQuestion}>Next</button>
        ) : (
          <button className={styles.submitButton} onClick={handleSubmit}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;
