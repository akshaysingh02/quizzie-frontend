import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import styles from "./AnalysisTable.module.css";
import delete_icon from "../../assets/icons/delete.svg";
import edit from "../../assets/icons/edit.svg";
import share from "../../assets/icons/share_green.svg";
import { deleteQuiz, getAllQuizzes } from "../../api/quiz";
import formatCreatedAt from "../../utils/dateconvert";
import QuestionWiseAnalysis from "../QuizAnalytics/QuestionWiseAnalysis";

Modal.setAppElement('#root'); // This is important for accessibility

export default function AnalysisTable() {
  const [quizData, setQuizData] = useState([]);
  const [selectedQuizData, setSelectedQuizData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

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
                    <img src={edit} alt="Edit" />
                    <img src={delete_icon} alt="Delete" onClick={() => openModal(data._id)} />
                    <img src={share} alt="Share" />
                  </td>
                  <td>
                    <a onClick={() => handleQuestionWiseAnalysis(data)}>Question Wise Analysis</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
          <button onClick={handleDelete}>Confirm Delete</button>
          <button onClick={closeModal}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}
