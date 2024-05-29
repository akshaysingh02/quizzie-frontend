// src/components/TakeQuiz.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
        const response = await axios.get(`http://localhost:4001/quiz/take/${uniqueLink}`);
        setQuizData(response.data.quizData);
      } catch (error) {
        setError("Quiz not found");
      }
    };

    fetchQuizData();
  }, [uniqueLink]);

  useEffect(() => {
    if (quizData && quizData.questions[currentQuestionIndex].type === "q&a" && quizData.questions[currentQuestionIndex].timer > 0) {
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
      if (currentQuestionIndex === quizData.questions.length - 1) {
        handleSubmit();
      } else {
        handleNextQuestion();
      }
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
      setTimer(quizData.questions[currentQuestionIndex + 1].type === "q&a" ? quizData.questions[currentQuestionIndex + 1].timer : null);
    }
  };

  const handleSubmit = async () => {
    const answers = quizData.questions.map((question) => ({
      questionId: question._id,
      selectedOption: responses[question._id],
    }));

    try {
      const response = await axios.post(`http://localhost:4001/submit/${uniqueLink}`, { answers });
      if (quizData.type === "q&a") {
        navigate("/thank-you", { state: { message: `Congrats, quiz is completed!`, data: response.data } });
      } else {
        navigate("/thank-you", { state: { message: `Thank you for participating in the poll!` } });
      }
    } catch (error) {
      console.error("Error submitting quiz responses", error);
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!quizData) {
    return <p>Loading...</p>;
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div className={styles.wrapper}>
      <h1>{quizData.title}</h1>
      <p>Question {currentQuestionIndex + 1}/{quizData.questions.length}</p>
      {timer !== null && <p>Time remaining: {timer} seconds</p>}
      <div className={styles.question}>
        <h2>{currentQuestion.questionText}</h2>
        <div className={styles.options}>
          {currentQuestion.options.map((option) => (
            <div
              key={option._id}
              className={`${styles.option} ${responses[currentQuestion._id] === option._id ? styles.selected : ''} ${!timerActive ? styles.disabled : ''}`}
              onClick={() => handleOptionClick(currentQuestion._id, option._id)}
            >
              {option.optionType === "text" && <span>{option.text}</span>}
              {option.optionType === "image" && <img src={option.imageUrl} alt={option.text} />}
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
        <button onClick={handleNextQuestion}>Next</button>
      ) : (
        <button onClick={handleSubmit}>Submit</button>
      )}
    </div>
  );
};

export default TakeQuiz;
