import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaPencilAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import * as questionClient from "./client";
import { setQuestions, deleteQuestion, updateQuestion } from "./reducer";

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
  
  const handleAddPossibleAnswer = (questionId: string) => {
    // Find the question to update
    const questionToUpdate = questions.find((q: any) => q._id === questionId);
    if (!questionToUpdate) {
      console.error("Question not found.");
      return;
    }
    // Add a new empty answer
    const updatedQuestion = {
      ...questionToUpdate,
      choicesAnswers: [...questionToUpdate.choicesAnswers, ""], // Add new blank answer
    };
    // Dispatch the updated question to Redux
    dispatch(updateQuestion(updatedQuestion));
  };

  const handleDeletePossibleAnswer = (questionId: string, answerIndex: number) => {
    // Find the question to update
    const questionToUpdate = questions.find((q: any) => q._id === questionId);
    if (!questionToUpdate) {
      console.error("Question not found.");
      return;
    }

    // Remove the answer at the specified index
    const updatedChoices = questionToUpdate.choicesAnswers.filter((_:any, index:any) => index !== answerIndex);
    // Update the question in Redux
    const updatedQuestion = { ...questionToUpdate, choicesAnswers: updatedChoices };
    dispatch(updateQuestion(updatedQuestion));
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
                  <textarea
                    className="form-control"
                    id="question-text"
                    value={question?.questionText || ""}
                    onChange={(e) => dispatch(updateQuestion({ ...question, questionText: e.target.value }))}
                  ></textarea>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label"><b>Possible Answers</b></label>
                  <button
                        type="button"
                        className="btn btn-outline-secondary mt-2"
                        onClick={() => handleAddPossibleAnswer(question._id)}
                      >
                        <FaPlus /> Add Answer
                  </button>
                  {question.choicesAnswers.map((choice: any, cIndex: number) => (
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
                          const updatedChoices = question.choicesAnswers.map((c: any, i: number) => i === cIndex ? e.target.value : c);
                            dispatch(updateQuestion({ ...question, choicesAnswers: updatedChoices }));
                          }}
                        />

                        {/* Trash Icon to Remove every possible answer */}
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleDeletePossibleAnswer(question._id, cIndex)}
                        >
                          <FaTrash />
                        </button>

            
                    </div>
                  ))}

                  
                
                  
                  {question?.type === "true-false" && (
                    <div>
                      <div className="form-check">
                        <input
                          id="wd-question-true-input"
                          className="form-check-input"
                          type="checkbox"
                          onChange={() => {/* handler fuction */ }}
                        />
                        <label className="form-check-label" htmlFor="wd-question-true-input">
                          True
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          id="wd-question-false-input"
                          className="form-check-input"
                          type="checkbox"
                          onChange={() => {/* handler fuction */ }}
                        />
                        <label className="form-check-label" htmlFor="wd-question-false-input">
                          False
                        </label>
                      </div>
                    </div>
                  )}
                  {question?.type === "fill-in-the-blank" && question.choices.map((choice: any) => (
                    <div key={choice} className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Correct Answer"
                        value={choice}
                        onChange={() => {/* handler fuction */ }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {/* handler fuction */ }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  {(question?.type === "multiple-choice" || question?.type === "fill-in-the-blank") && (
                    <a onClick={() => {/* handler fuction */ }}
                      className="float-end text-danger text-decoration-none d-flex align-items-center"
                      style={{ cursor: "pointer" }}>
                      <FaPlus className="me-2" />
                      Add Another Answer
                    </a>
                  )}
                </div>
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