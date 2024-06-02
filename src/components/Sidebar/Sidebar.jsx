import React, { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";
import { useNavigate } from "react-router-dom";
import CreateQuizModal from "../CreateQuizModal/CreateQuizModal";

export default function Sidebar({ selectedSection,onSidebarClick }) {
  const navigate = useNavigate();
  const handleLogOut = () => {
    localStorage.clear();
    navigate("/auth");
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleClick = (section) => {
    onSidebarClick(section);
  };

  //fortesting
  // useEffect(()=>{
  //   openModal()
  // },[])

  return (
    <div className={styles.sidebar}>
      <div className={styles.dashboard_logo}>QUIZZIE</div>
      <div className={styles.buttonsHolder}>
        <button
          className={`${selectedSection === "dashboard" ? styles.active : ""}`}
          onClick={() => handleClick("dashboard")}
        >
          Dashboard
        </button>
        <button className={`${selectedSection === "analytics" ? styles.active : ""}`}onClick={() => handleClick("analytics")}>Analytics</button>
        <button onClick={openModal}>Create Quiz</button>
      </div>
      <div className={styles.logoutHolder}>
        <button onClick={handleLogOut}>LOGOUT</button>
      </div>
      {isModalOpen && <CreateQuizModal closeModal={closeModal} />}
    </div>
  );
}
