import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import * as quizClient from "./client";

interface Quiz {
  _id?: string;
  title?: string;
  course?: string;
  points?: number;
  type?: string;
  assignmentGroup?: string;
  shuffleAnswers?: boolean;
  timeLimit?: number;
  multipleAttempts?: boolean;
  howManyAttempts?: number;
  showCorrectAnswers?: boolean;
  accessCode?: string;
  oneQuestionAtATime?: boolean;
  webcamRequired?: boolean;
  lockQuestionsAfterAnswering?: boolean;
  dueDate?: string;
  availableDate?: string;
  untilDate?: string;
  published?: boolean;
}

interface AccountState {
  currentUser: {
    role: string;
    [key: string]: any;
  };
}

interface QuizzesState {
  quizzes: Quiz[];
}

interface RootState {
  accountReducer: AccountState;
  quizzesReducer: QuizzesState;
}

export default function QuizDetails() {
  const { qid } = useParams<{ qid: string }>();
  const { cid } = useParams<{ cid: string }>();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<any>(null);
  const [accessCode, setAccessCode] = useState<string>("");

  useEffect(() => {
    const fetchQuiz = async () => {
      if (qid) {
        const fetchedQuiz = await quizClient.getQuiz(qid);
        setQuiz(fetchedQuiz);
      }
    };
    const fetchAnswers = async () => {
      if (qid && currentUser._id) {
        const fetchedAnswers = await quizClient.getAnswers(qid, currentUser._id);
        setAnswers(fetchedAnswers);
      }
    }
    fetchQuiz();
    fetchAnswers();
  }, [qid, currentUser._id]);

  if (!quiz) {
    return <div className="m-3">No quiz found with ID {qid}</div>;
  }

  // If student, just show Begin Quiz button (not faculty or admin)
  if (currentUser.role !== "FACULTY" && currentUser.role !== "ADMIN") {
    const studentAttempts = answers?.attempt ?? 0;
    console.log("Student attempts:", studentAttempts);
    if (!quiz.multipleAttempts && studentAttempts > 0 || studentAttempts >= (quiz.howManyAttempts ?? 1)) {
      return (
        <div>
          <h3 className="mt-2 mb-4 ms-3">{quiz.title}</h3>
          <p className="ms-3">You have reached the maximum number of attempts for this quiz.</p>
        </div>
      );
    }
    return (
      <div>
        <h3 className="mt-2 mb-4 ms-3">{quiz.title}</h3>
        <Link to={`/Kanbas/Courses/${cid}/Quizzes/${qid}/preview`}>
          <button className="btn btn-danger ms-3">Begin Quiz</button>
        </Link>
      </div>
    );
  }

  // FACULTY VIEW: Show detailed properties and Preview/Edit
  return (
    <div>
      <h3 className="mt-2 mb-4 ms-3">{quiz.title}</h3>
      <div className="ms-3 mb-3">
        <Link to={`/Kanbas/Courses/${cid}/Quizzes/${qid}/preview`}>
          <button className="btn btn-secondary me-2">Preview</button>
        </Link>
        <Link to={`/Kanbas/Courses/${cid}/Quizzes/${qid}/edit`}>
          <button className="btn btn-secondary">Edit</button>
        </Link>
      </div>
      <hr className="ms-3 me-3" />
      <div className="ms-3 me-3">

        <div className="row mb-2">
          <div className="col-3 text-end"><strong>Quiz Type</strong></div>
          <div className="col-9">{quiz.type || "Graded Quiz"}</div>
        </div>

        <div className="row mb-2">
          <div className="col-3 text-end"><strong>Points</strong></div>
          <div className="col-9">{quiz.points ?? 0}</div>
        </div>

        <div className="row mb-2">
          <div className="col-3 text-end"><strong>Assignment Group</strong></div>
          <div className="col-9">{quiz.assignmentGroup || "Quizzes"}</div>
        </div>

        <div className="row mb-2">
          <div className="col-3 text-end"><strong>Shuffle Answers</strong></div>
          <div className="col-9">{quiz.shuffleAnswers ? "Yes" : "No"}</div>
        </div>

        <div className="row mb-2">
          <div className="col-3 text-end"><strong>Time Limit</strong></div>
          <div className="col-9">{quiz.timeLimit ? `${quiz.timeLimit} minutes` : "No limit"}</div>
        </div>

        <div className="row mb-2">
          <div className="col-3 text-end"><strong>Multiple Attempts</strong></div>
          <div className="col-9">{quiz.multipleAttempts ? "Yes" : "No"}</div>
        </div>

        {quiz.multipleAttempts && (
          <div className="row mb-2">
            <div className="col-3 text-end"><strong>How Many Attempts</strong></div>
            <div className="col-9">{quiz.howManyAttempts ?? 1}</div>
          </div>
        )}

        <div className="row mb-2">
          <div className="col-3 text-end"><strong>Show Correct Answers</strong></div>
          <div className="col-9">{quiz.showCorrectAnswers ? "Immediately" : "After submission"}</div>
        </div>

        <div className="row mb-2">
          <div className="col-3 text-end"><strong>Access Code</strong></div>
          <div className="col-9">{quiz.accessCode || ""}</div>
        </div>

        <div className="row mb-2">
          <div className="col-3 text-end"><strong>One Question at a Time</strong></div>
          <div className="col-9">{quiz.oneQuestionAtATime ? "Yes" : "No"}</div>
        </div>

        <div className="row mb-2">
          <div className="col-3 text-end"><strong>Webcam Required</strong></div>
          <div className="col-9">{quiz.webcamRequired ? "Yes" : "No"}</div>
        </div>

        <div className="row mb-2">
          <div className="col-3 text-end"><strong>Lock Questions after Answering</strong></div>
          <div className="col-9">{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</div>
        </div>

        <div className="row mb-2">
          <div className="col-3 text-end"><strong>Due Date</strong></div>
          <div className="col-9">{quiz.dueDate ? new Date(quiz.dueDate).toLocaleString('en-US',
            { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) : ""}</div>
        </div>

        <div className="row mb-2">
          <div className="col-3 text-end"><strong>Available</strong></div>
          <div className="col-9">
            From {quiz.availableDate ? new Date(quiz.availableDate).toLocaleString('en-US',
              { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) : ""} <span>Until</span> {quiz.untilDate ? new Date(quiz.untilDate).toLocaleString('en-US',
                { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
