import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  questions: [],
};
const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload;
    },
    addQuestion: (state, { payload: question }) => {
      const newQuestion: any = {
        _id: new Date().getTime().toString(),
        ...question,
      };
      state.questions = [...state.questions, newQuestion] as any;
    },
    deleteQuestion: (state, { payload: questionId }) => {
      state.questions = state.questions.filter(
      (a: any) => a._id !== questionId
      );
    },
    updateQuestion: (state, { payload: question }) => {
      state.questions = state.questions.map((a: any) =>
        a._id === question._id ? question : a
      ) as any;
    },
    editQuestion: (state, { payload: questionId }) => {
      state.questions = state.questions.map((a: any) =>
        a._id === questionId ? { ...a, editing: true } : a
      ) as any;
    },
    cancelUpdate: (state, { payload: questionId }) => {
      state.questions = state.questions.map((a: any) =>
        a._id === questionId ? { ...a, editing: false } : a
      ) as any;
    },
  },
});
export const { setQuestions, addQuestion, deleteQuestion, updateQuestion, editQuestion, cancelUpdate } = questionsSlice.actions;
export default questionsSlice.reducer;