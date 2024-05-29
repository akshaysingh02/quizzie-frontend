import axios from "axios";
const backendUrl = "http://localhost:4001";

export const createQuiz = async (quizPayload) => {
  try {
    const reqUrl = `${backendUrl}/create-quiz`;
    const token = JSON.parse(localStorage.getItem("token"));
    axios.defaults.headers.common["Authorization"] = token;
    const response = await axios.post(reqUrl, quizPayload);
  } catch (error) {
    return error.response.data;
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
        const reqUrl = `${backendUrl}/trending-quizzes/${userId}`
        const token = JSON.parse(localStorage.getItem("token"));
        axios.defaults.headers.common["Authorization"] = token;
    
        const response = await axios.get(reqUrl,userId)
        return response?.data
    } catch (error) {
        console.log("Can't get trending quizzes", error);
    }
}
export const getAllQuizzes = async () => {
    try {
        const userId = JSON.parse(localStorage.getItem("userId")) || "";
        const reqUrl = `${backendUrl}/all-quizzes/${userId}`
        const token = JSON.parse(localStorage.getItem("token"));
        axios.defaults.headers.common["Authorization"] = token;
    
        const response = await axios.get(reqUrl,userId)
        return response?.data
    } catch (error) {
        console.log("Can't get the quizzes", error);
    }
}


