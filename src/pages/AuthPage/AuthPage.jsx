import React from 'react';
import AuthForm from '../../components/auth/AuthForm';
import styles from './AuthPage.module.css'

function AuthPage(){
  return (
    <div className={styles.authPage}>
      <AuthForm />
    </div>
  );
};

export default AuthPage;