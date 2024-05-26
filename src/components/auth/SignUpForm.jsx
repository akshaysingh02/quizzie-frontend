import React, { useState } from "react";
import styles from "./loginsignup.module.css";
import { registerUser } from "../../api/auth";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async () => {
    if (
      !formData.email ||
      !formData.name ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Fields can't be empty");
      return;
    }
    await registerUser(formData);
  };

  return (
    <div className={styles.SignUpform}>
      <div className={styles.formGroup}>
        <label>Name</label>
        <input
          className={styles.input}
          onChange={handleChange}
          name="name"
          type="text"
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Email</label>
        <input
          className={styles.input}
          onChange={handleChange}
          name="email"
          type="email"
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Password</label>
        <input
          className={styles.input}
          onChange={handleChange}
          name="password"
          type="password"
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Confirm Password</label>
        <input
          className={styles.input}
          onChange={handleChange}
          name="confirmPassword"
          type="password"
          required
        />
      </div>
      <button
        onClick={handleSubmit}
        className={styles.submitButton}
        type="submit"
      >
        Sign-Up
      </button>
    </div>
  );
}
