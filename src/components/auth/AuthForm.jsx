import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignUpForm";
import styles from './AuthForm.module.css'

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={styles.authContainer}>
    <div className={styles.logoHolder}><h1>QUIZZIE</h1></div>
      <div className={styles.tabs}>
        <button
          className={isLogin ? styles.active : ""}
          onClick={() => setIsLogin(true)}
        >
          Sign Up
        </button>
        <button
          className={!isLogin ? styles.active : ""}
          onClick={() => setIsLogin(false)}
        >
          Log In
        </button>
      </div>
      <div className={styles.formContainer}>
        {isLogin ? <SignupForm /> : <LoginForm />}
      </div>
    </div>
  );
}
