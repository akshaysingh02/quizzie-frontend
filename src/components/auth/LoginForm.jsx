import React, { useState } from "react";
import styles from "./loginsignup.module.css";
import { loginUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      alert("Fields can't be empty");
      return;
    }
    //api call to login
    const result = await loginUser(formData);
    if (result) {
      navigate("/");
    }
  };

  return (
    <div className={styles.SignUpform}>
      <div className={styles.formGroup}>
        <label>Email</label>
        <input className={styles.input} value={formData.email} onChange={handleChange} type="email" name="email" required />
      </div>
      <div className={styles.formGroup}>
        <label>Password</label>
        <input className={styles.input} value={formData.password} onChange={handleChange} type="password" name="password" required />
      </div>
      <button onClick={handleSubmit} className={styles.submitButton} type="submit">
        Log-In
      </button>
    </div>
  );
}
