import React from 'react'
import Dashboard from '../../components/Dashboard/Dashboard'
import styles from "./DashboardPage.module.css"


export default function DashboardPage() {
  return (
    <div className={styles.dashboardPage}>
        <Dashboard />
    </div>
  )
}
