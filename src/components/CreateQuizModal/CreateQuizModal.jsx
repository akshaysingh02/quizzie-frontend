import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import styles from "./CreateQuizModal.module.css";
import { createQuiz } from "../../api/quiz";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import delete_icon from "../../assets/icons/delete.svg";

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
        timer: 0,
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
              { text: "", imageUrl: "", isCorrect: false, optionType: "" },
            ],
            timer: 0,
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
    field === "timer"
      ? (updatedQuestions[qIndex][field] = Number(e.target.value))
      : (updatedQuestions[qIndex][field] = e.target.value);
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
    navigator.clipboard
      .writeText(fullUrl)
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
      .catch((err) => console.error("Error copying to clipboard:", err));
  };

  return (
    <Modal isOpen onRequestClose={closeModal} className={styles.modal} overlayClassName={styles.overlay}>
      {step === 1 && (
        <div className={styles.createQuizStep1wrapper}>
          <input
            type="text"
            placeholder="Quiz name"
            value={quizData.title}
            onChange={(e) => handleChange(e, "title")}
            className={`${styles.quizNameInput} ${
              !quizData.title ? styles.error : ""
            }`}
          />
          <div className={styles.quizTypeRadioWrapper}>
            <p>Quiz Type</p>
            <label className={styles.customRadioButton}>
              <input
                className={styles.radioButton}
                type="radio"
                value="q&a"
                checked={quizData.type === "q&a"}
                onChange={(e) => handleChange(e, "type")}
              />
              <span>Q & A</span>
            </label>
            <label className={styles.customRadioButton}>
              <input
                className={styles.radioButton}
                type="radio"
                value="poll"
                checked={quizData.type === "poll"}
                onChange={(e) => handleChange(e, "type")}
              />
              <span>Poll Type</span>
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
              style={{ backgroundColor: "#60B84B", color: "white" }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className={styles.step2}>
          <div className={styles.tabContainer}>
            <div className={styles.tabs}>
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
            <p className={styles.decorative1}>Max 5 questions</p>
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
                  className={`${styles.quizNameInput} ${
                    !question.questionText ? styles.error : ""
                  }`}
                />
                <div className={styles.optionTypeWrapper}>
                  <label>Option Type:</label>
                  <div className={styles.radioGroup}>
                    <label className={styles.customRadioButton}>
                      <input
                        type="radio"
                        value="text"
                        checked={question.optionType === "text"}
                        onChange={(e) => handleOptionTypeChange(e, qIndex)}
                      />
                      <span>Text</span>
                    </label>
                    <label className={styles.customRadioButton}>
                      <input
                        type="radio"
                        value="image"
                        checked={question.optionType === "image"}
                        onChange={(e) => handleOptionTypeChange(e, qIndex)}
                      />
                      <span>Image URL</span>
                    </label>
                    <label className={styles.customRadioButton}>
                      <input
                        type="radio"
                        value="text-image"
                        checked={question.optionType === "text-image"}
                        onChange={(e) => handleOptionTypeChange(e, qIndex)}
                      />
                      <span>Text & Image URL</span>
                    </label>
                  </div>
                </div>

                <div className={styles.opitonAndTimerWrapper}>
                  <div className={styles.optionsWrapper}>
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className={styles.optionContainer}>
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
                          </label>
                        )}
                        {(question.optionType === "text" ||
                          question.optionType === "text-image") && (
                          <input
                            type="text"
                            placeholder="Text"
                            value={option.text}
                            onChange={(e) =>
                              handleOptionChange(e, qIndex, oIndex, "text")
                            }
                            className={`${styles.optionInput} ${
                              !option.text && question.optionType !== "image"
                                ? styles.error
                                : ""
                            } ${option.isCorrect === true ? styles.correctInput : ""}`}
                          />
                        )}
                        {(question.optionType === "image" ||
                          question.optionType === "text-image") && (
                          <input
                            type="text"
                            placeholder="Image URL"
                            value={option.imageUrl}
                            onChange={(e) =>
                              handleOptionChange(e, qIndex, oIndex, "imageUrl")
                            }
                            className={`${styles.optionInput} ${
                              !option.imageUrl && question.optionType !== "text"
                                ? styles.error
                                : ""
                            }${option.isCorrect === true ? styles.correctInput : ""}`}
                          />
                        )}

                        {question.options.length > 2 && (
                          <button
                            className={styles.deleteButton}
                            onClick={() => removeOption(qIndex, oIndex)}
                          >
                            <img src={delete_icon} alt="option delete button" />
                          </button>
                        )}
                      </div>
                    ))}
                    {question.options.length < 5 && (
                      <button
                        style={{ width: "250px", marginLeft: "40px" }}
                        className={styles.whiteButton}
                        onClick={() => addOption(qIndex)}
                      >
                        Add Option
                      </button>
                    )}
                  </div>
                  {quizData.type === "q&a" && (
                    <div className={styles.TimerWrapper}>
                      <p>Timer</p>
                      <div className={styles.timerRadioGroup}>
                        <label className={styles.customRadioButtonTimer}>
                          <input
                            type="radio"
                            value={0}
                            checked={question.timer === 0}
                            onChange={(e) =>
                              handleQuestionChange(e, qIndex, "timer")
                            }
                          />
                          <span>Off</span>
                        </label>
                        <label className={styles.customRadioButtonTimer}>
                          <input
                            type="radio"
                            value={5}
                            checked={question.timer === 5}
                            onChange={(e) =>
                              handleQuestionChange(e, qIndex, "timer")
                            }
                          />
                          <span>5 sec</span>
                        </label>
                        <label className={styles.customRadioButtonTimer}>
                          <input
                            type="radio"
                            value={10}
                            checked={question.timer === 10}
                            onChange={(e) =>
                              handleQuestionChange(e, qIndex, "timer")
                            }
                          />
                          <span>10 sec</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null
          )}
          <div className={styles.buttonGroup}>
            <button onClick={closeModal}>Cancel</button>
            <button className={styles.createButton} onClick={handleSubmit}>Create Quiz</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className={styles.congratulationsWrapper}>
          <div className={styles.closeButton} onClick={closeModal}>
            &times;
          </div>
          <div className={styles.messageWrapper}>
            <h1>Congrats your Quiz is Published!</h1>
          </div>
          <div className={styles.linkHolder}>
            <p>{`http://localhost:3000/quiz/take/${quizLink}`}</p>
          </div>
          <button className={styles.linkCopyButton} onClick={handleCopyLink}>
            Share
          </button>
        </div>
      )}
      <ToastContainer />
    </Modal>
  );
}
