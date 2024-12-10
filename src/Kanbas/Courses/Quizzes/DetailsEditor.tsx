import { Link, useParams, useNavigate } from "react-router-dom";
import * as db from "../../Database";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addQuiz, updateQuiz, cancelUpdate } from "./reducer";
import * as coursesClient from "../client";
import * as quizzesClient from "./client";
import Editor from 'react-simple-wysiwyg';
export default function QuizEditor() {
    const { cid, qid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const [quiz, setQuiz] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState("details");
    useEffect(() => {
        const fetchQuiz = async () => {
            if (qid) {
                const fetchedQuiz = await quizzesClient.getQuiz(qid);
                setQuiz(fetchedQuiz);
            }
            else {
                setQuiz({
                    title: "New Quiz",
                    description: "New Quiz Description",
                    course: "",
                    type: "Graded Quiz",
                    points: 0,
                    assignmentGroup: "Quizzes",
                    shuffleAnswers: true,
                    timeLimit: 20,
                    multipleAttempts: false,
                    howManyAttempts: 1,
                    showCorrectAnswers: false,
                    accessCode: "",
                    oneQuestionAtATime: true,
                    webcamRequired: false,
                    lockQuestionsAfterAnswering: false,
                    dueDate: new Date().toISOString(),
                    availableDate: new Date().toISOString(),
                    untilDate: new Date().toISOString(),
                    published: false,
                    numberOfQuestions: 0,
                });
            }
        };
        fetchQuiz();
    }, [qid]);

    const handleSave = async () => {
        if (!qid) {
            const newQuiz = { ...quiz, _id: new Date().getTime().toString(), course: cid };
            if (cid) {
                const savedQuiz = await coursesClient.createQuizForCourse(cid, newQuiz);
                dispatch(addQuiz(savedQuiz));
            }
            dispatch(addQuiz(newQuiz));
            navigate(`/Kanbas/Courses/${cid}/Quizzes/${newQuiz._id}`);
        } else {
            const updatedQuiz = await quizzesClient.updateQuiz(quiz);
            dispatch(updateQuiz(updatedQuiz));
            navigate(`/Kanbas/Courses/${cid}/Quizzes/${qid}`);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setQuiz({ ...quiz, [field]: value });
    };

    const handleCancel = () => {
        dispatch(cancelUpdate(qid));
        navigate(`/Kanbas/Courses/${cid}/Quizzes`);
    };
    const handleSaveAndPublish = async () => {
        if (!quiz) return;
        if (!qid) {
            const newQuiz = { ...quiz, published: true, _id: new Date().getTime().toString(), course: cid };
            if (cid) {
                const savedQuiz = await coursesClient.createQuizForCourse(cid, newQuiz);
                dispatch(addQuiz(savedQuiz));
            }
        } else {
            const updatedQuiz = { ...quiz, published: true };
            const updatedQuizResponse = await quizzesClient.updateQuiz(updatedQuiz);
            dispatch(updateQuiz(updatedQuizResponse)); // Ensure reducer handles undefined values
        }
        navigate(`/Kanbas/Courses/${cid}/Quizzes`);
    };

    return (
        <div id="wd-quizzes-details-editor" className="container mt-4">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center ">
                <h2>{qid ? "Edit Quiz" : "New Quiz"}</h2>
                <div className="text-end">
                    <h5 className="mb-0">
                        Points: <strong>{quiz?.points || 0}</strong>
                    </h5>
                    <h5 className="mb-0">
                        {quiz?.published ? (
                            <span className="text-success">Published</span>
                        ) : (
                            <span className="text-danger">Not Published</span>
                        )}
                    </h5>
                </div>
            </div>
            {/* Details Section */}
            <div className="row mb-2">
                <div className="col">
                    <label htmlFor="wd-name">Quiz Name</label>
                    <input
                        id="wd-name"
                        className="form-control mt-2"
                        value={quiz?.title || ""}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col">
                    <label htmlFor="wd-description">Quiz Description</label>
                    <Editor
                        id="wd-description"
                        className="form-control mt-2"
                        value={quiz?.description || ""}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                </div>
            </div>
            <div className="container mt-3">
                <div className="col">
                    <div className="row mb-3 align-items-center">
                        <div className="col-md-4 text-end">
                            <label htmlFor="wd-quiz-type">Quiz Type</label>
                        </div>
                        <div className="col-md-8">
                            <select
                                id="wd-quiz-type"
                                className="form-select"
                                value={quiz?.type || "Graded Quiz"}
                                onChange={(e) => handleInputChange("type", e.target.value)}
                                disabled={!quiz}
                            >
                                <option value="Graded Quiz">Graded Quiz</option>
                                <option value="Practice Quiz">Practice Quiz</option>
                                <option value="Graded Survey">Graded Survey</option>
                                <option value="Ungraded Survey">Ungraded Survey</option>
                            </select>
                        </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                        <div className="col-md-4 text-end">
                            <label htmlFor="wd-points">Points</label>
                        </div>
                        <div className="col-md-8">
                            <input
                                id="wd-points"
                                className="form-control"
                                value={quiz?.points || ""}
                                onChange={(e) => handleInputChange("points", e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row mb-3 align-items-center">
                        <div className="col-md-4 text-end">
                            <label htmlFor="wd-assignment-group">Assignment Group</label>
                        </div>
                        <div className="col-md-8">
                            <select
                                id="wd-assignment-group"
                                className="form-select"
                                value={quiz?.assignmentGroup || "Quizzes"}
                                onChange={(e) => handleInputChange("assignmentGroup", e.target.value)}
                                disabled={!quiz}
                            >
                                <option value="Quizzes">Quizzes</option>
                                <option value="Exams">Exams</option>
                                <option value="Assignments">Assignments</option>
                                <option value="Project">Project</option>
                            </select>
                        </div>
                    </div>
                    <div className="row mb-3 align-items-center">
                        <div className="col-md-4 text-end">
                            <label htmlFor="wd-shuffle-answers">Shuffle Answers</label>
                        </div>
                        <div className="col-md-8">
                            <div className="form-check">
                                <input
                                    id="wd-shuffle-answers"
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={quiz?.shuffleAnswers || false}
                                    onChange={(e) => handleInputChange("shuffleAnswers", e.target.checked)}
                                    disabled={!quiz}
                                />
                                <label className="form-check-label" htmlFor="wd-shuffle-answers">
                                    Yes
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3 align-items-center">
                        <div className="col-md-4 text-end">
                            <label htmlFor="wd-time-limit">Time Limit (minutes)</label>
                        </div>
                        <div className="col-md-8">
                            <input
                                id="wd-time-limit"
                                className="form-control"
                                type="number"
                                value={quiz?.timeLimit || 20}
                                onChange={(e) => handleInputChange("timeLimit", e.target.value)}
                                disabled={!quiz}
                            />
                        </div>
                    </div>
                    <div className="row mb-3 align-items-center">
                        <div className="col-md-4 text-end">
                            <label htmlFor="wd-multiple-attempts">Multiple Attempts</label>
                        </div>
                        <div className="col-md-8">
                            <div className="form-check">
                                <input
                                    id="wd-multiple-attempts"
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={quiz?.multipleAttempts || false}
                                    onChange={(e) => handleInputChange("multipleAttempts", e.target.checked)}
                                    disabled={!quiz}
                                />
                                <label className="form-check-label" htmlFor="wd-multiple-attempts">
                                    Yes
                                </label>
                            </div>
                        </div>
                    </div>
                    {quiz?.multipleAttempts && (
                        <div className="row mb-3 align-items-center">
                            <div className="col-md-4 text-end">
                                <label htmlFor="wd-how-many-attempts">How Many Attempts</label>
                            </div>
                            <div className="col-md-8">
                                <input
                                    id="wd-how-many-attempts"
                                    className="form-control"
                                    type="number"
                                    value={quiz?.howManyAttempts || 1}
                                    onChange={(e) => handleInputChange("howManyAttempts", e.target.value)}
                                    disabled={!quiz}
                                />
                            </div>
                        </div>
                    )}
                    <div className="row mb-3 align-items-center">
                        <div className="col-md-4 text-end">
                            <label htmlFor="wd-show-correct-answers">Show Correct Answers</label>
                        </div>
                        <div className="col-md-8">
                            <select
                                id="wd-show-correct-answers"
                                className="form-select"
                                value={quiz?.showCorrectAnswers || "Never"}
                                onChange={(e) => handleInputChange("showCorrectAnswers", e.target.value)}
                                disabled={!quiz}
                            >
                                <option value="Never">Never</option>
                                <option value="After Each Attempt">After Each Attempt</option>
                                <option value="After Due Date">After Due Date</option>
                            </select>
                        </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                        <div className="col-md-4 text-end">
                            <label htmlFor="wd-access-code">Access Code</label>
                        </div>
                        <div className="col-md-8">
                            <input
                                id="wd-access-code"
                                className="form-control"
                                type="text"
                                value={quiz?.accessCode || ""}
                                onChange={(e) => handleInputChange("accessCode", e.target.value)}
                                disabled={!quiz}
                            />
                        </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                        <div className="col-md-4 text-end">
                            <label htmlFor="wd-one-question-at-a-time">One Question at a Time</label>
                        </div>
                        <div className="col-md-8">
                            <div className="form-check">
                                <input
                                    id="wd-one-question-at-a-time"
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={quiz?.oneQuestionAtATime || false}
                                    onChange={(e) => handleInputChange("oneQuestionAtATime", e.target.checked)}
                                    disabled={!quiz}
                                />
                                <label className="form-check-label" htmlFor="wd-one-question-at-a-time">
                                    Yes
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                        <div className="col-md-4 text-end">
                            <label htmlFor="wd-webcam-required">Webcam Required</label>
                        </div>
                        <div className="col-md-8">
                            <div className="form-check">
                                <input
                                    id="wd-webcam-required"
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={quiz?.webcamRequired || false}
                                    onChange={(e) => handleInputChange("webcamRequired", e.target.checked)}
                                    disabled={!quiz}
                                />
                                <label className="form-check-label" htmlFor="wd-webcam-required">
                                    Yes
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                        <div className="col-md-4 text-end">
                            <label htmlFor="wd-lock-questions-after-answering">Lock Questions After Answering</label>
                        </div>
                        <div className="col-md-8">
                            <div className="form-check">
                                <input
                                    id="wd-lock-questions-after-answering"
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={quiz?.lockQuestionsAfterAnswering || false}
                                    onChange={(e) => handleInputChange("lockQuestionsAfterAnswering", e.target.checked)}
                                    disabled={!quiz}
                                />
                                <label className="form-check-label" htmlFor="wd-lock-questions-after-answering">
                                    Yes
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-4 text-end">
                            <label htmlFor="wd-assign">Assign</label>
                        </div>
                        <div className="col-md-8">
                            <fieldset className="border p-3">
                                <div className="mb-3">
                                    <label htmlFor="wd-due-date"><strong>Due</strong></label>
                                    <input
                                        type="datetime-local"
                                        id="wd-due-date"
                                        className="form-control"
                                        value={quiz?.dueDate || ""}
                                        onChange={(e) => handleInputChange("dueDate", e.target.value)}
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <label htmlFor="wd-available-from"><strong>Available from</strong></label>
                                        <input
                                            type="datetime-local"
                                            id="wd-available-from"
                                            className="form-control"
                                            value={quiz?.availableDate || ""}
                                            onChange={(e) => handleInputChange("availableDate", e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="wd-available-until"><strong>Until</strong></label>
                                        <input
                                            type="datetime-local"
                                            id="wd-available-until"
                                            className="form-control"
                                            value={quiz?.untilDate || ""}
                                            onChange={(e) => handleInputChange("untilDate", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col text-end">
                    <hr />
                    <button className="btn btn-secondary me-2" type="button" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button className="btn btn-danger" type="button" onClick={handleSave}>
                        Save
                    </button>
                    <button className="btn btn-danger ms-2" type="button" onClick={handleSaveAndPublish}>
                        Save & Publish
                    </button>
                </div>
            </div>
        </div>
    );
}