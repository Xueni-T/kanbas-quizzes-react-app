import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import * as quizClient from "./client";
import * as questionClient from "./Questions/client";
import "./QuizView.css";
import { useSelector } from "react-redux";

export default function SubmittedQuiz() {
  const { qid, cid } = useParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [answer, setAnswer] = useState<any>(null);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [earnedScore, setEarnedScore] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);

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

    const fetchAnswers = async () => {
      if (qid) {
        try {
          const fetchedAnswers = await quizClient.getAnswers(qid, currentUser._id);
          setAnswer(fetchedAnswers)
          setAnswers(fetchedAnswers.answers || []);
        } catch (error) {
          console.error("Error fetching answers:", error);
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
    fetchAnswers();
  }, [qid, currentUser._id, questions]);

  useEffect(() => {
    // Calculate total scores once questions and answers are available
    if (questions.length > 0) {
      let totalEarned = 0;
      let totalPossible = 0;

      questions.forEach((question) => {
        const isCorrect = question.correctAnswers
          .map((ans: string) => ans.toLowerCase())
          .includes(answers[question._id]?.toLowerCase());
        const pointsAwarded = isCorrect ? question.points : 0;
        totalEarned += pointsAwarded;
        totalPossible += question.points;
      });

      setEarnedScore(totalEarned);
      setTotalScore(totalPossible);
    }
  }, [questions, answers]);

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
          <div className="question-points">{(question.correctAnswers.map((ans: string) => ans.toLowerCase()).includes(answers[question._id]?.toLowerCase())) ?
            `${question.points} / ${question.points}` :
            `0 / ${question.points}`} pts</div>
        </div>
        <p className="question-text">
          {question.questionText || "No question text available"}
        </p>
        {(() => {
          switch (question.questionType) {
            case "Multiple Choice":
              return (
                <ul className="options-list">
                  {question.choicesAnswers.map((choice: string, index: number) => (
                    <li
                      key={`${question._id}-choice-${index}`}
                      className="option-item"
                    >
                      <input
                        type="radio"
                        name={question._id}
                        id={`option-${index}`}
                        value={choice}
                        className="radio-input"
                        checked={answers[question._id] === choice}
                        disabled
                      />
                      <label htmlFor={`option-${index}`}>{choice}</label>
                      {!question.correctAnswers.includes(choice) && answers[question._id] === choice && (
                        <>
                          <span className="correct-arrow" style={{ color: 'red' }}>✘</span>
                          <span className="correct-answer" style={{ color: 'red' }}>Wrong Answer</span>
                        </>
                      )}
                      {question.correctAnswers.includes(choice) && (
                        <>
                          <span className="correct-arrow" style={{ color: 'green' }}>✔</span>
                          <span className="correct-answer" style={{ color: 'green' }}>Correct Answer</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              );
              case "True/False":
                return (
                  <ul className="options-list">
                    {["true", "false"].map((option) => {
                      const isCorrect = question.correctAnswers.includes(option);
                      const isSelected = answers[question._id]?.toLowerCase() === option;
              
                      return (
                        <li className="option-item" key={option}>
                          <input
                            type="radio"
                            name={question._id}
                            value={option}
                            className="radio-input"
                            checked={isSelected}
                            disabled
                          />
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                          {isSelected && !isCorrect && (
                            <>
                              <span className="correct-arrow" style={{ color: "red" }}>✘</span>
                              <span className="correct-answer" style={{ color: "red" }}>Wrong Answer</span>
                            </>
                          )}
                          {isCorrect && (
                            <>
                              <span className="correct-arrow" style={{ color: "green" }}>✔</span>
                              <span className="correct-answer" style={{ color: "green" }}>Correct Answer</span>
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                );
              
            case "Fill in the Blank":
              return (
                <div>
                  <input
                    type="text"
                    name={question._id}
                    placeholder="Type your answer here"
                    className="fill-blank-input"
                    value={answers[question._id]}
                    disabled
                  />
                  <div className="correct-answer-box">
                    {answers[question._id] && !question.correctAnswers.includes(answers[question._id]) && (
                      <div className="wrong-answer-text" style={{ color: 'red' }}>
                        <span className="wrong-answer-label">Your Answer: </span>
                        {answers[question._id]} <span className="wrong-answer-cross">✘</span>
                      </div>
                    )}
                    <span className="correct-answer-label" style={{ color: 'green' }}>Correct Answers: </span>
                    {question.correctAnswers.map((choice: string, index: number) => (
                      <div key={index} className="correct-answer-text" style={{ color: 'green' }}>
                        {choice}
                      </div>
                    ))}
                  </div>
                </div>
              );
          }
        })()}
      </div>
    );
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      
      <h1 className="quiz-title">{quiz.title}</h1>
      <p className="quiz-description">{quiz.description}</p>
      <h3>Grade: {earnedScore}/{totalScore}</h3>
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
            <button
              className="action-button update-button"
              disabled={currentQuestionIndex >= questions.length - 1}
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div>
          {questions.map((question, index) => renderQuestion(question, index))}
        </div>
      )}
    </div>
  );
}