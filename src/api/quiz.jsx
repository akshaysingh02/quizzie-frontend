import axios from "axios";
const backendUrl = "https://quizzie-server-h49m.onrender.com";

export const createQuiz = async (quizPayload) => {
  try {
    const reqUrl = `${backendUrl}/create-quiz`;
    const token = JSON.parse(localStorage.getItem("token"));
    axios.defaults.headers.common["Authorization"] = token;
    const response = await axios.post(reqUrl, quizPayload);
    console.log(response?.data);
    return response?.data;
  } catch (error) {
    console.log("Unable to create quiz", error);
    return error.response.data;
  }
};

export const updateQuiz = async (quizPayLoad, quizId) => {
  try {
    const reqUrl = `${backendUrl}/update/${quizId}`;
    const token = JSON.parse(localStorage.getItem("token"));
    axios.defaults.headers.common["Authorization"] = token;
    const response = await axios.put(reqUrl,quizPayLoad);
    return response?.data;
  } catch (error) {
    console.log("Can't update the quiz", error);
  }
};

export const getQuickAnalytics = async () => {
  try {
    const reqUrl = `${backendUrl}/analytics`;
    const token = JSON.parse(localStorage.getItem("token"));
    axios.defaults.headers.common["Authorization"] = token;
    const response = await axios.get(reqUrl);
    return response?.data;
  } catch (error) {
    console.log("Can't get quick analytics", error);
  }
};

export const getTrendingQuizzes = async () => {
  try {
    const userId = JSON.parse(localStorage.getItem("userId")) || "";
    const reqUrl = `${backendUrl}/trending-quizzes/${userId}`;
    const token = JSON.parse(localStorage.getItem("token"));
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.get(reqUrl, userId);
    return response?.data;
  } catch (error) {
    console.log("Can't get trending quizzes", error);
  }
};
export const getAllQuizzes = async () => {
  try {
    const userId = JSON.parse(localStorage.getItem("userId")) || "";
    const reqUrl = `${backendUrl}/all-quizzes/${userId}`;
    const token = JSON.parse(localStorage.getItem("token"));
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.get(reqUrl, userId);
    return response?.data;
  } catch (error) {
    console.log("Can't get the quizzes", error);
  }
};

export const deleteQuiz = async (quizId) => {
  try {
    const reqUrl = `${backendUrl}/delete/${quizId}`;
    const token = JSON.parse(localStorage.getItem("token"));
    axios.defaults.headers.common["Authorization"] = token;
    const response = await axios.delete(reqUrl);
    return response?.data;
  } catch (error) {
    console.log("unable to delete the quiz", error);
  }
};
