import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignUpForm";
import styles from './AuthForm.module.css'
import { Navigate } from "react-router-dom";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(false); // Default to false for signup form
  const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.logoHolder}><h1>QUIZZIE</h1></div>
      <div className={styles.tabs}>
        <button
          className={!isLogin ? styles.active : ""}
          onClick={() => setIsLogin(false)}
        >
          Sign Up
        </button>
        <button
          className={isLogin ? styles.active : ""}
          onClick={() => setIsLogin(true)}
        >
          Log In
        </button>
      </div>
      <div className={styles.formContainer}>
        {isLogin ? <LoginForm /> : <SignupForm setIsLogin={setIsLogin} />}
      </div>
    </div>
  );
}
