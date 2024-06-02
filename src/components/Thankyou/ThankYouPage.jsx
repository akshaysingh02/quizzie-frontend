import React from "react";
import { useLocation } from "react-router-dom";
import styles from "./ThankYou.module.css";
import trophyImage from "../../assets/icons/trophy.png"

export default function ThankYouPage() {
  const { state } = useLocation();
  return (
    <>
      {!!state ? (
        <div className={styles.pageWrapper}>
          <div className={styles.componentWrapper}>
            <h1
              className={`${
                state.message === "Thank you for participating in the poll!"
                  ? styles.typePoll
                  : styles.typeQA
              }`}
            >
              {state.message}
            </h1>
            {state.data && (
              <div className={styles.tropyWrapper}>
                <img src={trophyImage} alt="decorative" />
                <div className={styles.scoreWrapper}>
                  Your Score is <span>{JSON.stringify(state.data.score)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.errorDiv}>
          <h1 className={styles.errorH1}>404 not found</h1>
        </div>
      )}
    </>
  );
}
