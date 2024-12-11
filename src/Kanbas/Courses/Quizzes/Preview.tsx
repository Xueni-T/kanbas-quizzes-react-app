import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import * as quizClient from "./client";
import * as questionClient from "./Questions/client";
import "./QuizView.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function QuizView() {
  const { qid, cid } = useParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  let totalScore = 0;
  const navigate = useNavigate();
  const handleSubmitQuiz = async () => {
    let result = null;
    if (qid) {
      result = await quizClient.submitQuiz(qid, currentUser._id);
      if (result) {
        navigate(`/Kanbas/Courses/${cid}/Quizzes`);
      } else {
        console.error("Error submitting quiz");
        return;
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const answerUpdate = { questionId: name, updateAnswer: value };
    if (qid) {
      quizClient.addAnswerToMap(qid, currentUser._id, answerUpdate);
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      if (qid) {
        try {
          const fetchedQuestions = await questionClient.findQuestionsForQuiz(qid);
          setQuestions(fetchedQuestions || []);
        } catch (error) {
          console.error("Error fetching questions:", error);
          setQuestions([]);
        }
      }
    };

    const fetchQuiz = async () => {
      if (qid) {
        try {
          const fetchedQuiz = await quizClient.getQuiz(qid);
          setQuiz(fetchedQuiz);
        } catch (error) {
          console.error("Error fetching quiz:", error);
          setQuiz(null);
        }
      }
      setLoading(false);
    };

    fetchQuiz();
    fetchQuestions();
  }, [qid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  const renderQuestion = (question: any, index: number) => {
    if (!question) {
      return <p className="unknown-type">Question data is missing</p>;
    }
    
    return (
      <div key={question._id} className="question-card">
        <div className="question-header">
          <div className="question-title">Question {index + 1}</div>
          <div className="question-points">{question.points || 0} pts</div>
        </div>
        <p className="question-text">
          {question.questionText || "No question text available"}
        </p>
        {(() => {
          switch (question.questionType) {
            case "Multiple Choice":
              return (
                <ul className="options-list">
                  {(quiz.shuffleAnswers ? question.choicesAnswers.sort(() => Math.random() - 0.5) : question.choicesAnswers)
                    .map((choice: string, index: number) => (
                      <li
                        key={`${question._id}-choice-${index}`}
                        className="option-item"
                      >
                        <input onChange={handleInputChange}
                          type="radio"
                          name={question._id}
                          id={`option-${index}`}
                          value={choice}
                          className="radio-input"
                        />
                        <label htmlFor={`option-${index}`}>{choice}</label>
                      </li>
                    ))}
                </ul>
              );
            case "True/False":
              return (
                <ul className="options-list">
                  <li className="option-item">
                    <input onChange={handleInputChange}
                      type="radio"
                      name={question._id}
                      value="True"
                      className="radio-input"
                    />
                    True
                  </li>
                  <li className="option-item">
                    <input onChange={handleInputChange}
                      type="radio"
                      name={question._id}
                      value="False"
                      className="radio-input"
                    />
                    False
                  </li>
                </ul>
              );
            case "Fill in the Blank":
              return (
                <div>
                  <input onChange={handleInputChange}
                    type="text"
                    name={question._id}
                    placeholder="Type your answer here"
                    className="fill-blank-input"
                  />
                </div>
              );
            default:
              return <p className="unknown-type">Unknown question type</p>;
          }
        })()}
      </div>
    );
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1 className="quiz-title">{quiz.title}</h1>
        {currentUser.role === "FACULTY" && (<Link to={`/Kanbas/Courses/${cid}/Quizzes/${qid}/Edit`} className="action-button update-button">
          Edit Quiz
        </Link>)}
      </div>
      <p className="quiz-instructions">{quiz.description}</p>
      <hr className="quiz-divider" />

      {quiz.oneQuestionAtATime ? (
        <div>
          {currentQuestion ? (
            renderQuestion(currentQuestion, currentQuestionIndex)
            
          ) : (
            <p className="unknown-type">No question available</p>
          )}
          <div className="action-buttons">
            <button
              className="action-button update-button"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            >
              Previous
            </button>
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                className="action-button update-button"
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              >
                Next
              </button>
            ) : (
              <div className="submit-quiz">
                <button onClick={handleSubmitQuiz} className="action-button update-button">
                  Submit Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          {questions.map((question, index) => renderQuestion(question, index))}
          <div className="submit-quiz">
            <button onClick={handleSubmitQuiz} className="action-button update-button">
              Submit Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}