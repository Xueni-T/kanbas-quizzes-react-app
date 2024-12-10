import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaPencilAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import * as questionClient from "./client";
import { setQuestions, deleteQuestion, updateQuestion } from "./reducer";
import Editor from 'react-simple-wysiwyg';
export default function QuestionEditor() {
  const { cid, qid } = useParams();
  const dispatch = useDispatch();
  const questions = useSelector((state: any) => state.questionsReducer.questions);
  const [editingPencil, setEditingPencil] = useState<string | null>(null);

  const [editingQuestion, setEditingQuestion] = useState<any>(null);

  const fetchQuestions = async () => {
    const questions = await questionClient.findQuestionsForQuiz(qid as string);
    dispatch(setQuestions(questions));
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAddNewQuestion = async () => {
    const newQuestion = {
      title: "New Question",
      questionType: "Multiple Choice",
      points: 0,
      questionText: "",
      choicesAnswers: [],
      correctAnswers: [],
    };
    try {
      const savedQuestion = await questionClient.createQuestionForQuiz(qid as string, newQuestion);
      dispatch(setQuestions([...questions, savedQuestion]));
    } catch (error) {
      console.error("Error adding new question:", error);
    }
  };


  const handleDeleteQuestion = async (questionId: string) => {
    console.log(`Deleting question with ID: ${questionId}`); // Debugging
    try {
      await questionClient.deleteQuestion(questionId);
      dispatch(deleteQuestion(questionId));

    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleInputChange = async (field: string, value: any, question: any) => {
    setEditingQuestion({ ...question, [field]: value });
  };

  const handleUpdateQuestion = async (questionId: string, updatedFields: any) => {
    try {
      // Find the original question
      const questionToUpdate = questions.find((q: any) => q._id === questionId);
      if (!questionToUpdate) {
        console.error("Question not found for update.");
        return;
      }
      // Merge the updated fields with the original question
      const updatedQuestion = { ...questionToUpdate, ...updatedFields };
      // Send the updated question to the backend
      const savedQuestion = await questionClient.updateQuestion(updatedQuestion);
      // Update the Redux store with the saved question
      dispatch(updateQuestion(savedQuestion));
      // Exit edit mode
      setEditingPencil(null);
      console.log("Question updated successfully:", savedQuestion);
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleAddCorrectAnswer = (questionId: string) => {
    // Find the question to update
    const questionToUpdate = questions.find((q: any) => q._id === questionId);
    if (!questionToUpdate) {
      console.error("Question not found.");
      return;
    }
    // Add a new empty answer
    const updatedQuestion = {
      ...questionToUpdate,
      correctAnswers: [...questionToUpdate.correctAnswers, ""], // Add new blank answer
    };
    // Dispatch the updated question to Redux
    dispatch(updateQuestion(updatedQuestion));
  };

  const handleAddChoicesAnswer = (questionId: string) => {
    const questionToUpdate = questions.find((q: any) => q._id === questionId);
    if (!questionToUpdate) {
      console.error("Question not found.");
      return;
    }
    const updatedQuestion = {
      ...questionToUpdate,
      choicesAnswers: [...questionToUpdate.choicesAnswers, ""],
    };
    // Dispatch the updated question to Redux
    dispatch(updateQuestion(updatedQuestion));
  };

  const handleDeleteCorrectAnswer = async (questionId: string, answerIndex: number) => {
    console.log("handleDeletePossibleAnswer called with:", questionId, answerIndex);
    // Find the question to update
    const questionToUpdate = questions.find((q: any) => q._id === questionId);
    if (!questionToUpdate) {
      console.error("Question not found.");
      return;
    }

    console.log("Question to update:", questionToUpdate);
    console.log("Current correctAnswers:", questionToUpdate.correctAnswers);

    // Remove the answer at the specified index
    const updatedCorrectAnswers = questionToUpdate.correctAnswers.filter((_: any, index: any) => index !== answerIndex);
    console.log("Updated choices:", updatedCorrectAnswers);

    // Update the question in Redux
    const updatedQuestion = { ...questionToUpdate, correctAnswers: updatedCorrectAnswers };
    dispatch(updateQuestion(updatedQuestion));
    console.log("Updated question dispatched:", updatedQuestion);

    // Make an API call to save the updated question to the backend
    try {
      await questionClient.updateQuestion(updatedQuestion);
      console.log("Question updated on the backend successfully.");
    } catch (error) {
      console.error("Failed to update the question on the backend:", error);
    }
  };

  const handleDeleteChoicesAnswer = async (questionId: string, answerIndex: number) => {
    console.log("handleDeletePossibleAnswer called with:", questionId, answerIndex);
    // Find the question to update
    const questionToUpdate = questions.find((q: any) => q._id === questionId);
    if (!questionToUpdate) {
      console.error("Question not found.");
      return;
    }

    console.log("Question to update:", questionToUpdate);
    console.log("Current correctAnswers:", questionToUpdate.correctAnswers);

    // Remove the answer at the specified index
    const updatedChoicesAnswers = questionToUpdate.choicesAnswers.filter((_: any, index: any) => index !== answerIndex);
    console.log("Updated choices:", updatedChoicesAnswers);

    // Update the question in Redux
    const updatedQuestion = { ...questionToUpdate, choicesAnswers: updatedChoicesAnswers };
    dispatch(updateQuestion(updatedQuestion));
    console.log("Updated question dispatched:", updatedQuestion);

    // Make an API call to save the updated question to the backend
    try {
      await questionClient.updateQuestion(updatedQuestion);
      console.log("Question updated on the backend successfully.");
    } catch (error) {
      console.error("Failed to update the question on the backend:", error);
    }
  };

  return (
    <div className="wd-question-editor">
      {/* List of Questions */}
      <ul className="wd-question-list list-group mt-3">
        {questions.map((question: any) => (
          <li className="list-group-item mb-3 border border-dark rounded-1">
            <div className="d-flex justify-content-between align-items-center">
              {question.title}
              <div className="fs-5">
                <FaPencilAlt className="text-primary me-2"
                  onClick={() => { setEditingPencil(editingPencil === question._id ? null : question._id) }} />
                <FaTrash className="text-danger"
                  onClick={() => handleDeleteQuestion(question._id)} />
              </div>
            </div>
            {editingPencil === question._id && (
              <div className="mt-3">
                <div className="form-group mb-3">
                  <label className="form-label" htmlFor="question-name"><b>Name</b></label>
                  <input
                    type="text"
                    className="form-control"
                    id="question-name"
                    value={question?.title || ""}
                    onChange={(e) => dispatch(updateQuestion({ ...question, title: e.target.value }))}
                  />
                </div>
                <div className="form-group mb-3 d-flex justify-content-between">
                  <div className="w-50">
                    <label className="form-label" htmlFor="question-type"><b>Question Type</b></label>
                    <select
                      className="form-select"
                      id="question-type"
                      value={question?.questionType || ""}
                      onChange={(e) => dispatch(updateQuestion({ ...question, questionType: e.target.value }))}
                    >
                      <option value="Multiple Choice">Multiple Choice</option>
                      <option value="True/False">True/False</option>
                      <option value="Fill in the Blank">Fill in the Blank</option>
                    </select>
                  </div>
                  <div className="w-25">
                    <label className="form-label" htmlFor="question-points"><b>Points</b></label>
                    <input
                      type="number"
                      className="form-control"
                      id="question-points"
                      value={question?.points || ""}
                      onChange={(e) => dispatch(updateQuestion({ ...question, points: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="form-group mb-3">
                  <label className="form-label" htmlFor="question-text"><b>Question</b></label>
                  <Editor
                    className="form-control"
                    id="question-text"
                    value={question?.questionText || ""}
                    onChange={(e) => dispatch(updateQuestion({ ...question, questionText: e.target.value }))}
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="form-label"><b>Correct Answers</b></label>
                  <button
                    type="button"
                    className="btn btn-outline-secondary mt-2"
                    style={{ marginLeft: '20px', marginBottom: '10px', color: 'black' }}
                    onClick={() => handleAddCorrectAnswer(question._id)}
                  >
                    <FaPlus /> Add
                  </button>
                  {question.correctAnswers.map((choice: any, cIndex: number) => (
                    <div
                      key={cIndex}
                      className={`input-group mb-2 ${question.correctAnswers.includes(choice) ? "correct-answer" : ""}`}
                    >
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Answer"
                        value={choice}
                        onChange={(e) => {
                          const updatedChoices = question.correctAnswers.map((c: any, i: number) => i === cIndex ? e.target.value : c);
                          dispatch(updateQuestion({ ...question, correctAnswers: updatedChoices }));
                        }}
                      />

                      {/* Trash Icon to Remove every possible answer */}
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleDeleteCorrectAnswer(question._id, cIndex)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
                {question?.questionType === "Multiple Choice" && (
                  <div className="form-group mb-3">
                    <label className="form-label"><b>Possible Answers</b></label>
                    <button
                      type="button"
                      className="btn btn-outline-secondary mt-2"
                      style={{ marginLeft: '20px', marginBottom: '10px', color: 'black' }}
                      onClick={() => handleAddChoicesAnswer(question._id)}
                    >
                      <FaPlus /> Add
                    </button>
                    <p>Select one as the single correct answer</p>
                    {question.choicesAnswers.map((choice: any, cIndex: number) => (
                      <div
                        key={cIndex}
                        className={`input-group mb-2 ${question.choicesAnswers.includes(choice) ? "possible-answer" : ""}`}
                      >
                        <textarea
                          className="form-control"
                          placeholder="Option"
                          value={choice}
                          onChange={(e) => {
                            const updatedChoices = question.choicesAnswers.map((c: any, i: number) => i === cIndex ? e.target.value : c);
                            dispatch(updateQuestion({ ...question, choicesAnswers: updatedChoices }));
                          }}
                        />

                        {/* Radio Button to Select Correct Answer */}
                        <div className="input-group-text">
                          <input
                            type="radio"
                            name={`correct-answer-${question._id}`}
                            checked={question.correctAnswers.includes(choice)}
                            onChange={() => {
                              const updatedCorrectAnswers = [choice];
                              dispatch(updateQuestion({ ...question, correctAnswers: updatedCorrectAnswers }));
                            }}
                          />
                        </div>

                        {/* Trash Icon to Remove every possible answer */}
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleDeleteChoicesAnswer(question._id, cIndex)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}

                  </div>)}
                <br /><hr />
                <div className="d-flex justify-content-start">
                  <button type="button" className="btn btn-light border texxt-secondary me-2" onClick={() => setEditingPencil(null)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => handleUpdateQuestion(question._id, editingQuestion)}>
                    Update Question
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="text-center mt-3">
        <button className="btn btn-lg btn-secondary" onClick={handleAddNewQuestion}>
          <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
          New Question
        </button>
      </div>
      {/* Save and Cancel buttons */}
      <div className="col text-end">
        <hr />
        <div className="d-flex float-end">
          <Link to={`/Kanbas/Courses/${cid}/Quizzes`}>
            <button className="btn btn-light border text-secondary mx-1">Cancel</button>
          </Link>
          <button type="button" className="btn btn-danger border border-dark mx-1">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}