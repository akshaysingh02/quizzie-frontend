import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import styles from "./AnalysisTable.module.css";
import delete_icon from "../../assets/icons/delete.svg";
import edit from "../../assets/icons/edit.svg";
import share from "../../assets/icons/share_green.svg";
import { deleteQuiz, getAllQuizzes } from "../../api/quiz";
import formatCreatedAt from "../../utils/dateconvert";
import QuestionWiseAnalysis from "../QuizAnalytics/QuestionWiseAnalysis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root"); // This is important for accessibility

export default function AnalysisTable() {
  const [quizData, setQuizData] = useState([]);
  const [selectedQuizData, setSelectedQuizData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

  const frontEndLink = "https://master--vermillion-cuchufli-5fa6d1.netlify.app"

  const fetchAllQuizzes = async () => {
    const result = await getAllQuizzes();
    setQuizData(result?.data);
  };

  const handleQuestionWiseAnalysis = (quiz) => {
    setSelectedQuizData(quiz);
  };

  const handleBackToQuizList = () => {
    setSelectedQuizData(null);
  };

  const handleDelete = async () => {
    if (quizToDelete) {
      await deleteQuiz(quizToDelete);
      fetchAllQuizzes();
      closeModal();
    }
  };

  const openModal = (quizId) => {
    setQuizToDelete(quizId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setQuizToDelete(null);
  };

  const handleCopy = (uniqueLink) => {
    console.log(uniqueLink);
    const fullUrl = `${frontEndLink}/quiz/take/${uniqueLink}`;
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

  useEffect(() => {
    fetchAllQuizzes();
  }, []);

  return (
    <div className={styles.wrapper}>
      {selectedQuizData ? (
        <QuestionWiseAnalysis
          questions={selectedQuizData.questions}
          title={selectedQuizData.title}
          impressions={selectedQuizData.impressions}
          createdAt={selectedQuizData.createdAt}
          type={selectedQuizData.type}
          onBack={handleBackToQuizList}
        />
      ) : (
        <>
          <h1>Quiz Analysis</h1>
          {quizData.length !== 0 ? (
            <>
          <table className={styles.AnalysisTable}>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Quiz Name</th>
                <th>Created on</th>
                <th>Impression</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {quizData?.map((data, index) => (
                <tr key={data._id}>
                  <td>{index + 1}</td>
                  <td>{data.title}</td>
                  <td>{formatCreatedAt(data.createdAt)}</td>
                  <td>{data.impressions}</td>
                  <td>
                    <img className={styles.shareImg} src={edit} alt="Edit" />
                    <img
                      src={delete_icon}
                      alt="Delete"
                      onClick={() => openModal(data._id)}
                    />
                    <img
                      src={share}
                      alt="Share"
                      onClick={() => handleCopy(data.uniqueLink)}
                    />
                  </td>
                  <td>
                    <a onClick={() => handleQuestionWiseAnalysis(data)}>
                      Question Wise Analysis
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            </>
          ) : (
            <h2 className={styles.emptyQuizMessage}>Create Quizzes to access their analytics</h2>
          )}
        </>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel=""
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>Are you sure you want to delete this quiz?</h2>
        <div className={styles.modalActions}>
          <button className={styles.redButton} onClick={handleDelete}>Confirm Delete</button>
          <button onClick={closeModal}>Cancel</button>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
}
