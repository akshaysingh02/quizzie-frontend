// src/components/AnalysisTable.js
import React, { useState, useEffect } from "react";
import styles from "./AnalysisTable.module.css";
import delete_icon from "../../assets/icons/delete.svg";
import edit from "../../assets/icons/edit.svg";
import share from "../../assets/icons/share_green.svg";
import { getAllQuizzes } from "../../api/quiz";
import formatCreatedAt from "../../utils/dateconvert";
import { useNavigate } from "react-router-dom";
import QuestionWiseAnalysis from "../QuizAnalytics/QuestionWiseAnalysis";

export default function AnalysisTable() {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState([]);
  const [selectedQuizData, setSelectedQuizData] = useState(null);

  const fetchAllQuizzes = async () => {
    const result = await getAllQuizzes();
    setQuizData(result?.data);
  };

  useEffect(() => {
    fetchAllQuizzes();
  }, []);

  const handleQuestionWiseAnalysis = (quiz) => {
    setSelectedQuizData(quiz);
  };

  const handleBackToQuizList = () => {
    setSelectedQuizData(null);
  };

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
                    <img src={edit} alt="" />
                    <img src={delete_icon} alt="" />
                    <img src={share} alt="" />
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
    </div>
  );
}
