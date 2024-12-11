import "../../styles.css";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { BsGripVertical } from "react-icons/bs";
import { RxRocket } from "react-icons/rx";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import QuizControlButtons from "./QuizControlButtons";
import * as quizzesClient from "./client";
import * as coursesClient from "../client";
import * as questionsClient from "./Questions/client";
import { setQuizzes } from "./reducer";
import { useEffect } from "react";

export default function Quizzes() {
  const { cid } = useParams();
  const { qid } = useParams();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const quizzes = useSelector((state: any) => state.quizzesReducer.quizzes);
  const dispatch = useDispatch();

  const fetchQuizzes = async () => {
    try {
      const quizzes = await coursesClient.findQuizzesForCourse(cid as string);
      // Fetch questions for each quiz (for counting the number of questions)
      const quizzesWithQuestions = await Promise.all(quizzes.map(async (quiz: any) => {
        const questions = await questionsClient.findQuestionsForQuiz(quiz._id);
        return { ...quiz, questions };
      }));
      console.log("Fetched quizzes:", quizzes); // Logs the fetched quizzes
      dispatch(setQuizzes(quizzesWithQuestions));
    } catch (error) {
      console.error("Error fetching quizzes:", error); // Logs any errors
    }
  };

  useEffect(() => {
    console.log("cid value:", cid);
    fetchQuizzes();
  }, [cid]);


  return (
    <div id="wd-quizzes" className="m-5">
      <div id="wd-search-quizzes-box" className="row">
        <div className="col-8">

          <input
            id="wd-search-quizzes"
            placeholder="Search..."
            className="form-control"
            type="text"
            style={{ width: "500px" }}
          />
        </div>
        {currentUser.role === "FACULTY" && (
          <div className="col-4">
            <Link to={`/Kanbas/Courses/${cid}/Quizzes/new`}>
              <button
                id="wd-add-quizzes"
                className="btn btn-lg btn-danger me-1 float-end"
              >
                <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                Quiz
              </button>
            </Link>
          </div>
        )}
      </div>
      <br />
      <br />
      <ul className="list-group rounded-0">
        <li className="list-group-item p-0 fs-5 border-gray">
          <div className="wd-quizzes-title p-3 ps-3 bg-secondary">
            <BsGripVertical className="me-2 fs-3" />
            Assignment Quizzes
          </div>
        </li>
        <ul id="wd-quizzes-list" className="list-group rounded-0">
          {quizzes.map((quiz: any) => (
            <li
              key={quiz._id}
              className="wd-quiz-list-item list-group-item p-3 ps-1 fs-5"
            >
              <div className="row align-items-center">
                <div className="col-1 text-center">
                  <RxRocket className="text-success" />
                </div>
                <div className="col-9">
                  {currentUser.role === "STUDENT" && (!quiz.published || new Date() < new Date(quiz.availableDate) || new Date() > new Date(quiz.untilDate)) ? (
                    <span className="wd-quiz-link text-dark">{quiz.title}</span>
                  ) : (
                    <a
                      className="wd-quiz-link text-decoration-none text-dark"
                      href={`#/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`}
                    >
                      {quiz.title}
                    </a>
                  )}
                  <br />
                  <span className="fs-6 text-wrap">
                    {new Date() > new Date(quiz.availableDate) ? (
                      new Date() < new Date(quiz.untilDate) ? (
                        <strong className="text-danger">Available </strong>
                      ) : (
                        <strong>Closed </strong>
                      )
                    ) : (
                      <strong>Not available until </strong>
                    )}
                    {new Date(quiz.availableDate).toLocaleString('en-US',
                      { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })} | <strong>Due </strong>
                    {new Date(quiz.dueDate).toLocaleString('en-US',
                      { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })} | {quiz.points} pts
                    | {quiz.questions?.length || 0} Questions
                  </span>
                </div>
                <div className="col-2">
                  {cid && <QuizControlButtons quiz={quiz} cid={cid} />}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </ul>
    </div>
  );
}
