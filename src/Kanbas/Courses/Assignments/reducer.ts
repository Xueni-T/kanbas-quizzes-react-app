import { createSlice } from "@reduxjs/toolkit";
import { assignments as initialAssignments } from "../../Database";
const initialState = {
  assignments: initialAssignments,
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    addAssignment: (state, { payload: assignment }) => {
      const newAssignment: any = {
        _id: new Date().getTime().toString(),
        ...assignment,
      };
      state.assignments = [...state.assignments, newAssignment] as any;

    },
    deleteAssignment: (state, { payload: assignmentId }) => {
      state.assignments = state.assignments.filter(
        (a: any) => a._id !== assignmentId
      );
    },
    updateAssignment: (state, { payload: assignment }) => {
      state.assignments = state.assignments.map((a: any) =>
        a._id === assignment._id ? assignment : a
      ) as any;
    },
    editAssignment: (state, { payload: assignmentId }) => {
      state.assignments = state.assignments.map((a: any) =>
        a._id === assignmentId ? { ...a, editing: true } : a
      ) as any;
    },
    cancelUpdate: (state, { payload: assignmentId }) => {
      state.assignments = state.assignments.map((a: any) =>
        a._id === assignmentId ? { ...a, editing: false } : a
      ) as any;
    }
  },
});

export const { addAssignment, deleteAssignment, updateAssignment, editAssignment, cancelUpdate } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;