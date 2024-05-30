import React, { useEffect, useState } from "react";
import styles from "./TrendingQuizzes.module.css";
import eyes from "../../assets/icons/eyes.svg";
import { getTrendingQuizzes } from "../../api/quiz";
import formatCreatedAt from "../../utils/dateconvert";
export default function TredingQuizzes() {
  const [quizData, setQuizData] = useState([]);

  const fetchAllQuizzes = async () => {
    const result = await getTrendingQuizzes();
    setQuizData(result?.data);
    // console.log(typeof(quizData.length))
  };

  useEffect(() => {
    fetchAllQuizzes();
  }, []);

  return (
    <div className={styles.wrapper}>
      {quizData.length !== 0 ? (
        <>
          <h2>Trending Quizzes</h2>
          <div className={styles.quizBoxWrapper}>
            {quizData?.map((data) => {
              return (
                <div key={data._id} className={styles.quizBox}>
                  <div className={styles.data}>
                    <p>{data.title}</p>
                    <div className={styles.impressionCountWrapper}>
                      <span className={styles.impressionCount}>
                        {data.impressions}
                      </span>
                      <img src={eyes} alt="decorative" />
                    </div>
                  </div>
                  <div className={styles.date}>
                    {formatCreatedAt(data.createdAt)}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className={styles.emptyTredingquizzes}>
          There are no quizzes treding right now
        </div>
      )}
    </div>
  );
}
