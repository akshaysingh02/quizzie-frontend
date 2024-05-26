import axios from "axios";
import React from "react";
const backendUrl = "http://localhost:4001/api/auth";

export const registerUser = async ({ name, email, password }) => {
  try {
    const regUrl = `${backendUrl}/signup`;
    const response = await axios.post(regUrl, { name, email, password });
    return;
  } catch (error) {
    console.log(error);
    alert("can't register user");
  }
};

export const loginUser = async ({email,password}) => {
  try {
    const regUrl = `${backendUrl}/login`
    const response = await axios.post(regUrl,{email,password})
    if(response.data?.token){
        localStorage.setItem("token",JSON.stringify(response.data?.token))
        localStorage.setItem("name",JSON.stringify(response.data?.name))
        localStorage.setItem("userId",JSON.stringify(response.data?.userId))
    }
  } catch (error) {
    console.log(error);
    alert("Can't login, Something went wrong")
  }
};