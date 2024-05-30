import React, { useState } from "react";
import styles from "./loginsignup.module.css";
import { loginUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const result = await loginUser(formData);
    if (result) {
      navigate("/");
    } else {
      setErrors({ ...errors, email: "Invalid credentials" });
    }
  };

  return (
    <div className={styles.SignUpform}>
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
      <button
        onClick={handleSubmit}
        className={styles.submitButton}
        type="button"
      >
        Log-In
      </button>
    </div>
  );
}
