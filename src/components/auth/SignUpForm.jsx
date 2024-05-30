import React, { useState } from "react";
import styles from "./loginsignup.module.css";
import { registerUser } from "../../api/auth";


export default function SignupForm({ setIsLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const result = await registerUser(formData);
    if (result === 409) {
      setErrors({ ...errors, email: "This email is already in use" });
    } else if (result === 200) {
      setIsLogin(true);
    } else {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className={styles.SignUpform}>
      <div className={styles.formGroup}>
        <label>Name</label>
        <div className={styles.inputWrapper}>
          <input
            className={`${styles.input} ${
              errors.name ? styles.inputError : ""
            }`}
            onChange={handleChange}
            name="name"
            type="text"
            value={formData.name}
            required
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>
      </div>
      <div className={styles.formGroup}>
        <label>Email</label>
        <div className={styles.inputWrapper}>
          <input
            className={`${styles.input} ${
              errors.email ? styles.inputError : ""
            }`}
            onChange={handleChange}
            name="email"
            type="email"
            value={formData.email}
            required
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>
      </div>
      <div className={styles.formGroup}>
        <label>Password</label>
        <div className={styles.inputWrapper}>
          <input
            className={`${styles.input} ${
              errors.password ? styles.inputError : ""
            }`}
            onChange={handleChange}
            name="password"
            type="password"
            value={formData.password}
            required
          />
          {errors.password && (
            <span className={styles.error}>{errors.password}</span>
          )}
        </div>
      </div>
      <div className={styles.formGroup}>
        <label>Confirm Password</label>
        <div className={styles.inputWrapper}>
        <input
          className={`${styles.input} ${
            errors.confirmPassword ? styles.inputError : ""
          }`}
          onChange={handleChange}
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          required
        />
        {errors.confirmPassword && (
          <span className={styles.error}>{errors.confirmPassword}</span>
        )}
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className={styles.submitButton}
        type="button"
      >
        Sign-Up
      </button>
    </div>
  );
}
