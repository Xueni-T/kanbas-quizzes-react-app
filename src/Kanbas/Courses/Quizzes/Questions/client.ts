import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const QUESTIONS_API = `${REMOTE_SERVER}/api/questions`;
const QUIZ_API = `${REMOTE_SERVER}/api/quizzes`;
const axiosWithCredentials = axios.create({ withCredentials: true });
export const deleteQuestion = async (questionId: string) => {
  try {
    console.log(`Calling API to delete question with ID: ${questionId}`);
    const response = await axiosWithCredentials.delete(`${QUESTIONS_API}/${questionId}`);
    console.log("Delete API response:", response);
    return response.data;
  } catch (error) {
    console.error(`Error deleting question with ID: ${questionId}`, error);
    throw error;
  }
};
export const updateQuestion = async (question: any) => {
  const { data } = await axiosWithCredentials.put(`${QUESTIONS_API}/${question._id}`, question);
  return data;
};
export const findQuestionsForQuiz = async (quizId: string) => {
  const response = await axiosWithCredentials.get(`${QUIZ_API}/${quizId}/questions`);
  return response.data;
};
export const createQuestionForQuiz = async (quizId: string, question: any) => {
  const response = await axiosWithCredentials.post(`${QUIZ_API}/${quizId}/questions`, question);
  return response.data;
};