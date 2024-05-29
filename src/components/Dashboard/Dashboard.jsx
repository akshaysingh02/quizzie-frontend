import React,{useState} from "react";
import styles from "./Dashboard.module.css";
import Sidebar from "../Sidebar/Sidebar";
import QuickReview from "../QuickReview/QuickReview";
import TredingQuizzes from "../trendingQuizes/TredingQuizzes";
import AnalysisTable from "../AnalysisTable/AnalysisTable";

export default function Dashboard() {
    const [selectedSection, setSelectedSection] = useState("analytics");

  const handleSidebarClick = (section) => {
    setSelectedSection(section);
  };
  return (
    <div className={styles.container}>
      <Sidebar onSidebarClick={handleSidebarClick} selectedSection={selectedSection} />
      <div className={styles.contentHolder}>
        {selectedSection === 'dashboard' && <QuickReview />}
        { selectedSection === 'dashboard' && <TredingQuizzes />}
        { selectedSection === 'analytics' && <AnalysisTable />}
      </div>
    </div>
  );
}
