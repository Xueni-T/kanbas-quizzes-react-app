import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const axiosWithCredentials = axios.create({ withCredentials: true });
const QUIZ_API = `${REMOTE_SERVER}/api/quizzes`;
const COURSE_API = `${REMOTE_SERVER}/api/courses`;
export const updateQuiz = async (quiz: any) => {
    const { data } = await axiosWithCredentials.put(`${QUIZ_API}/${quiz._id}`, quiz);
    return data;
};
export const deleteQuiz = async (quizId: string) => {
    const response = await axiosWithCredentials.delete(`${QUIZ_API}/${quizId}`);
    return response.data;
};
export const getQuiz = async (quizId: string) => {
    const { data } = await axiosWithCredentials.get(`${QUIZ_API}/${quizId}`);
    return data;
};
export const createQuiz = async (courseId: string, quiz: any) => {
    const { data } = await axiosWithCredentials.post(`${COURSE_API}/${courseId}/quizzes`, quiz);
    return data;
}
export const getQuizzes = async (courseId: string) => {
    const { data } = await axiosWithCredentials.get(`${COURSE_API}/${courseId}/quizzes`);
    return data;
}

export async function calculateScore(qid: string, userId: string) {
    try {
        const response = await axios.post(`/api/quizzes/${qid}/calculateScore`, {
            userId: userId,
        });
        return response.data.score;
    } catch (error) {
        console.error("Error calculating score:", error);
        return null;
    }
}
export async function updateQuizScore(qid: string, userId: string, score: number) {
    try {
        const response = await axios.put(`/api/quizzes/${qid}/updateScore`, {
            userId: userId,
            score: score,
        });
        return response.data.success;
    } catch (error) {
        console.error("Error updating quiz score:", error);
        return false;
    }
}

export const newAttempt = async (quizId: string, userId: string) => {
    const { data } = await axiosWithCredentials.post(`${QUIZ_API}/${quizId}/user/${userId}/answers`);
    return data;
}

export const submitQuiz = async (quizId: string, userId: string) => {
    const { data } = await axiosWithCredentials.put(`${QUIZ_API}/${quizId}/user/${userId}/answers/finished`);
    return data;
}

export const addAnswerToMap = async (quizId: string, userId: string, answer: any) => {
    const { data } = await axiosWithCredentials.put(`${QUIZ_API}/${quizId}/user/${userId}/answer`, answer);
    return data;
}

export const getAnswers = async (quizId: string, userId: string) => {
    const { data } = await axiosWithCredentials.get(`${QUIZ_API}/${quizId}/user/${userId}/answers`);
    return data;
}
export const getAnswerForQuestion = async (quizId: string, userId: string, questionId: string) => {
    const { data } = await axiosWithCredentials.get(`${QUIZ_API}/${quizId}/user/${userId}/answers/${questionId}`);
    return data;
}