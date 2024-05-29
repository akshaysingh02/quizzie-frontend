import React from "react";
import styles from "./QuestionWiseAnalysis.module.css";
import formatCreatedAt from "../../utils/dateconvert";
export default function QuestionWiseAnalysis({
  questions,
  title,
  impressions,
  createdAt,
  type,
  onBack,
}) {
  return (
    <div className={styles.dataWrapper}>
    <div className={styles.topSectionWrapper}>
      <button className={styles.backButton} onClick={onBack}>
        Back to Quiz List
      </button>
      <div className={styles.creationData}>
        created on: {formatCreatedAt(createdAt)} <br />
        impressions: {impressions}
      </div>
    </div>
      <h1>{title} - Question Wise Analysis</h1>
      {questions.map((data, index) => {
        return (
          <div key={data._id} className={styles.questionWrapper}>
            <h2 className={styles.questionText}>
              Q.{index + 1} {data.questionText}
            </h2>
            <div className={styles.dataBoxWrapper}>
              {type === "q&a" ? (
                <>
                  <div className={styles.dataBox}>
                    <h2>{data.attempts}</h2>people Attempted the question
                  </div>
                  <div className={styles.dataBox}>
                    <h2>{data.correctAnswers}</h2>people Answered Correctly
                  </div>
                  <div className={styles.dataBox}>
                    <h2>{data.incorrectAnswers}</h2>people Answered Incorrectly
                  </div>
                </>
              ) : (
                <>
                  {data.options.map((o, i) => {
                    return (
                      <div key={o._id} className={styles.dataBox}>
                        <h2>{data.optionSelections[o._id] || "0"}
                        </h2>{o.text}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
