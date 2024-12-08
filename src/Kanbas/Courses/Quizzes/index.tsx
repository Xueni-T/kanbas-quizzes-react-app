import "../../styles.css";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { BsGripVertical } from "react-icons/bs";
import { RxRocket } from "react-icons/rx";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import QuizControlButtons from "./QuizControlButtons";

export default function Quizzes() {
  const { cid } = useParams();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const quizzes = useSelector((state: any) => state.quizzesReducer.quizzes);

  if (!quizzes) {
    return <div>No quizzes available</div>;
  }

  return (
    <div id="wd-quizzes" className="m-5">
      <div id="wd-search-quizzes-box" className="row">
        <div className="col-8">
          <span>
            <FaMagnifyingGlass />
          </span>
          <input id="wd-search-quizzes" placeholder="Search..." className="form-control" type="text" style={{ width: "500px" }} />
        </div>
        {currentUser.role === "FACULTY" && <div className="col-4">
          <Link to={`/Kanbas/Courses/${cid}/Quizzes/edit/@`}>
            <button id="wd-add-quizzes" className="btn btn-lg btn-danger me-1 float-end">
              <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />Quiz</button></Link>
        </div>}
      </div>
      <br /><br />
      <ul className="list-group rounded-0">
        <li className="list-group-item p-0 fs-5 border-gray">
          <div className="wd-quizzes-title p-3 ps-3 bg-secondary">
            {currentUser.role === "FACULTY" && <BsGripVertical className="me-2 fs-3" />}
            Assignment Quizzes</div>
        </li>
        <ul id="wd-quizzes-list" className="list-group rounded-0">
          {currentUser.role === "FACULTY" &&
            (quizzes.filter((quiz: {
              _id: string,
              title: string,
              course: string,
              dateAvailable: string,
              timeAvailable: string,
              dueDate: string,
              dueTime: string,
              points: number,
              description: string,
              numQuestions: number,
              published: boolean
            }) =>
              (quiz.course === cid))
              .map((quiz: {
                _id: string,
                title: string,
                course: string,
                dateAvailable: string,
                timeAvailable: string,
                dueDate: string,
                dueTime: string,
                points: number,
                description: string,
                numQuestions: number,
                published: boolean
              }) => (
                <li className="wd-quiz-list-item list-group-item p-3 ps-1 fs-5">
                  <div className="row align-items-center">
                    <div className="col-1">
                      <BsGripVertical className="me-2 fs-3" />
                      <RxRocket className="text-success" />
                    </div>
                    <div className="col-9">
                      <a className="wd-quiz-link text-decoration-none text-dark"
                        href={`#/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`}>
                        {quiz.title}</a><br />
                      <span className="fs-6 text-wrap">
                        <span className="custom-gray1"><strong>Not available until
                        </strong> {quiz.dateAvailable} at {quiz.timeAvailable} | <strong>Due
                          </strong> {quiz.dueDate} {quiz.dueTime &&
                            <span>at {quiz.dueTime}</span>} | {quiz.points} pts | {quiz.numQuestions} Questions
                        </span></span>
                    </div>
                    <div className="col-2">
                      {cid && <QuizControlButtons quiz={quiz} cid={cid} />}
                    </div>
                  </div>
                </li>
              )))}
          {currentUser.role !== "FACULTY" &&
            (quizzes.filter((quiz: {
              _id: string,
              title: string,
              course: string,
              dateAvailable: string,
              timeAvailable: string,
              dueDate: string,
              dueTime: string,
              points: number,
              description: string,
              numQuestions: number,
              published: boolean,
              score: number
            }) => (quiz.course === cid && quiz.published))
              .map((quiz: {
                _id: string,
                title: string,
                course: string,
                dateAvailable: string,
                timeAvailable: string,
                dueDate: string,
                dueTime: string,
                points: number,
                description: string,
                numQuestions: number,
                published: boolean,
                score: number
              }) => (
                <li className="wd-quiz-list-item list-group-item p-3 ps-3 fs-5">
                  <div className="row align-items-center">
                    <div className="col-1 ms-2" style={{ width: "4%" }}>
                      <RxRocket />
                    </div>
                    <div className="col-11">
                      <a className="wd-quiz-link text-decoration-none text-dark"
                        href={`#/Kanbas/Courses/${cid}/Quizzes/${quiz._id}`}>
                        {quiz.title}</a><br />
                      <span className="fs-6 text-wrap">
                        <span className="custom-gray1"><strong>Not available until
                        </strong> {quiz.dateAvailable} at {quiz.timeAvailable} | <strong>Due
                          </strong> {quiz.dueDate} {quiz.dueTime &&
                            <span>at {quiz.dueTime}</span>} | {quiz.points} pts | {quiz.numQuestions} Questions | {quiz.score && <span>Last attempt score: {quiz.score}</span>}{!quiz.score && <span>Last attempt score: N/A</span>}
                        </span></span>
                    </div>
                  </div>
                </li>
              )))}
        </ul>
      </ul>
    </div>
  );
}