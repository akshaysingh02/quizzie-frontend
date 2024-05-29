import React, { useEffect, useState } from "react";
import styles from "./quickReview.module.css";
import { getQuickAnalytics } from "../../api/quiz";
export default function QuickReview() {

  const [data,setData] = useState([])

  const fetchQuickAnalysis = async () =>{
    const result = await getQuickAnalytics();
    setData(result)
  }

  useEffect(()=>{
    fetchQuickAnalysis();
  },[])


  return (
    <div className={styles.dataBoxWrapper}>
      <div className={`${styles.dataBox} ${styles.red}`}>
        <span >{data.totalQuizzes}</span> Quiz<br />created
      </div>
      <div className={`${styles.dataBox} ${styles.green}`}>
        <span >{data.totalQuestions}</span> Questions <br /> created
      </div>
      <div className={`${styles.dataBox} ${styles.purple}`}>
        <span>{data.totalImpressions}</span> total <br /> impressions
      </div>
    </div>

  );
}
