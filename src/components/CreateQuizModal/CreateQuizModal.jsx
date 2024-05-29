import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./CreateQuizModal.module.css";
import { createQuiz } from "../../api/quiz";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement("#root");

export default function CreateQuizModal({ closeModal }) {
  const [step, setStep] = useState(1);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [quizLink, setQuizLink] = useState("");
  const [quizData, setQuizData] = useState({
    title: "",
    type: "q&a",
    questions: [
      {
        questionText: "",
        options: [
          { text: "", imageUrl: "", isCorrect: false, optionType: "text" },
          { text: "", imageUrl: "", isCorrect: false, optionType: "text" },
        ],
        timer: 5,
        optionType: "text",
        type: "q&a",
      },
    ],
  });

  const addQuestion = () => {
    if (quizData.questions.length < 5) {
      setQuizData((prevData) => ({
        ...prevData,
        questions: [
          ...prevData.questions,
          {
            questionText: "",
            options: [
              { text: "", imageUrl: "", isCorrect: false, optionType: "" },
            ],
            timer: 5,
            optionType: "text",
            type: quizData.type,
          },
        ],
      }));
      setActiveQuestionIndex(quizData.questions.length);
    }
  };

  const removeQuestion = (index) => {
    if (quizData.questions.length > 1) {
      setQuizData((prevData) => ({
        ...prevData,
        questions: prevData.questions.filter((_, i) => i !== index),
      }));
      setActiveQuestionIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : 0
      );
    }
  };

  const addOption = (qIndex) => {
    const updatedQuestions = [...quizData.questions];
    if (updatedQuestions[qIndex].options.length < 5) {
      updatedQuestions[qIndex].options.push({
        text: "",
        imageUrl: "",
        isCorrect: false,
        optionType: updatedQuestions[qIndex].optionType,
      });
      setQuizData({ ...quizData, questions: updatedQuestions });
    }
  };

  const removeOption = (qIndex, oIndex) => {
    const updatedQuestions = [...quizData.questions];
    if (updatedQuestions[qIndex].options.length > 1) {
      updatedQuestions[qIndex].options = updatedQuestions[
        qIndex
      ].options.filter((_, i) => i !== oIndex);
      setQuizData({ ...quizData, questions: updatedQuestions });
    }
  };

  const handleChange = (e, field) => {
    setQuizData({ ...quizData, [field]: e.target.value });
  };

  const handleQuestionChange = (e, qIndex, field) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex][field] = e.target.value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleOptionChange = (e, qIndex, oIndex, field) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].options[oIndex][field] = e.target.value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleOptionTypeChange = (e, qIndex) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].optionType = e.target.value;
    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.map(
      (option) => ({
        ...option,
        optionType: e.target.value,
      })
    );
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleOptionCorrectChange = (qIndex, oIndex) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.map(
      (option, index) => ({
        ...option,
        isCorrect: index === oIndex,
      })
    );
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const validateForm = () => {
    const { title, questions } = quizData;
    if (!title) {
      alert("Please enter the quiz name to continue.");
      return false;
    }
    for (const question of questions) {
      if (!question.questionText) {
        alert("Please enter the question text.");
        return false;
      }
      if (
        quizData.type === "q&a" &&
        !question.options.some((option) => option.isCorrect)
      ) {
        alert("Each Q&A question must have one correct option.");
        return false;
      }
      for (const option of question.options) {
        if (question.optionType === "text" && !option.text) {
          alert("Please fill in all text options.");
          return false;
        }
        if (
          (question.optionType === "image" ||
            question.optionType === "text-image") &&
          !option.imageUrl
        ) {
          alert("Please fill in all image URLs.");
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        console.log(quizData);
        quizData.questions.map((item, index) => {
          item.type = quizData.type;
        });
        const response = await createQuiz(quizData);
        console.log(response.message);
        if (response && response.quizLink) {
          setQuizLink(response.quizLink);
          setStep(3);
        }
      } catch (error) {
        console.error("Error creating quiz:", error);
      }
    }
  };

  const handleCopyLink = () => {
    const fullUrl = `http://localhost:3000/quiz/take/${quizLink}`;
    navigator.clipboard.writeText(fullUrl)
      .then(() => {
        toast.success("Link copied to clipboard", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch(err => console.error('Error copying to clipboard:', err));
  };

  return (
    <Modal isOpen onRequestClose={closeModal} className={styles.modal}>
      {step === 1 && (
        <div>
          <h2>Create Quiz</h2>
          <input
            type="text"
            placeholder="Quiz name"
            value={quizData.title}
            onChange={(e) => handleChange(e, "title")}
            className={!quizData.title ? styles.error : ""}
          />
          <div>
            <label>
              <input
                type="radio"
                value="q&a"
                checked={quizData.type === "q&a"}
                onChange={(e) => handleChange(e, "type")}
              />
              Q & A
            </label>
            <label>
              <input
                type="radio"
                value="poll"
                checked={quizData.type === "poll"}
                onChange={(e) => handleChange(e, "type")}
              />
              Poll
            </label>
          </div>
          <div className={styles.buttonGroup}>
            <button onClick={closeModal}>Cancel</button>
            <button
              onClick={() =>
                quizData.title
                  ? setStep(2)
                  : alert("Please enter the quiz name to continue.")
              }
            >
              Continue
            </button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div>
          <h2>Add Questions</h2>
          <div className={styles.tabContainer}>
            {quizData.questions.map((_, qIndex) => (
              <div
                key={qIndex}
                className={`${styles.tab} ${
                  qIndex === activeQuestionIndex ? styles.activeTab : ""
                }`}
                onClick={() => setActiveQuestionIndex(qIndex)}
              >
                {qIndex + 1}
                {qIndex !== 0 && (
                  <button
                    className={styles.closeTab}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeQuestion(qIndex);
                    }}
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
            {quizData.questions.length < 5 && (
              <button className={styles.addTab} onClick={addQuestion}>
                +
              </button>
            )}
          </div>
          {quizData.questions.map((question, qIndex) =>
            qIndex === activeQuestionIndex ? (
              <div key={qIndex} className={styles.questionContainer}>
                <input
                  type="text"
                  placeholder={`${
                    quizData.type === "q&a" ? "Q&A" : "Poll"
                  } Question`}
                  value={question.questionText}
                  onChange={(e) =>
                    handleQuestionChange(e, qIndex, "questionText")
                  }
                  className={!question.questionText ? styles.error : ""}
                />
                {quizData.type === "q&a" && (
                  <div>
                    Timer:
                    <select
                      value={question.timer}
                      onChange={(e) => handleQuestionChange(e, qIndex, "timer")}
                    >
                      <option value={0}>Off</option>
                      <option value={5}>5 sec</option>
                      <option value={10}>10 sec</option>
                    </select>
                  </div>
                )}
                <div>
                  <label>
                    Option Type:
                    <select
                      value={question.optionType}
                      onChange={(e) => handleOptionTypeChange(e, qIndex)}
                    >
                      <option value="text">Text</option>
                      <option value="image">Image URL</option>
                      <option value="text-image">Text & Image URL</option>
                    </select>
                  </label>
                </div>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className={styles.optionContainer}>
                    {(question.optionType === "text" ||
                      question.optionType === "text-image") && (
                      <input
                        type="text"
                        placeholder="Option Text"
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(e, qIndex, oIndex, "text")
                        }
                        className={
                          !option.text && question.optionType !== "image"
                            ? styles.error
                            : ""
                        }
                      />
                    )}
                    {(question.optionType === "image" ||
                      question.optionType === "text-image") && (
                      <input
                        type="text"
                        placeholder="Option Image URL"
                        value={option.imageUrl}
                        onChange={(e) =>
                          handleOptionChange(e, qIndex, oIndex, "imageUrl")
                        }
                        className={
                          !option.imageUrl && question.optionType !== "text"
                            ? styles.error
                            : ""
                        }
                      />
                    )}
                    {quizData.type === "q&a" && (
                      <label>
                        <input
                          type="radio"
                          name={`correct-option-${qIndex}`}
                          checked={option.isCorrect}
                          onChange={() =>
                            handleOptionCorrectChange(qIndex, oIndex)
                          }
                        />
                        Correct
                      </label>
                    )}
                    {question.options.length > 2 && (
                      <button onClick={() => removeOption(qIndex, oIndex)}>
                        Remove Option
                      </button>
                    )}
                  </div>
                ))}
                {question.options.length < 5 && (
                  <button onClick={() => addOption(qIndex)}>Add Option</button>
                )}
              </div>
            ) : null
          )}
          <div className={styles.buttonGroup}>
            <button onClick={closeModal}>Cancel</button>
            <button onClick={handleSubmit}>Create Quiz</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className={styles.congratulationsWrapper}>
          <div className={styles.closeButton} onClick={closeModal}>&times;</div>
          <div className={styles.messageWrapper}>
            <h1>Congrats your Quiz is Published!</h1>
          </div>
          <div className={styles.linkHolder}>
            <p>{`http://localhost:3000/quiz/take/${quizLink}`}</p>
          </div>
          <button className={styles.linkCopyButton} onClick={handleCopyLink}>Share</button>
        </div>
      )}
      <ToastContainer />
    </Modal>
  );
}
