import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { BsBanFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { deleteQuiz, updateQuiz } from "./reducer";
import * as quizzesClient from "./client";
import { useState } from "react";



export default function QuizControlButtons({quiz, cid}: {quiz: any,  cid:string}) {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const quizzes = useSelector((state: any) => state.quizzesReducer.quizzes);


  
    const removeQuizz = async () => {
        try {
            await quizzesClient.deleteQuiz(quiz._id);
            dispatch(deleteQuiz(quiz._id));
            console.log("Quiz deleted successfully:", quiz._id);
        } catch (error) {
            console.error("Failed to delete quiz:", error);
        }
    };
    const publishQuiz = async (quiz: any) => {
      
        try {
          // Create an updated quiz object with the 'published' field set to true
          const updatedQuiz = { ...quiz, published: true };
      
          // Send the updated quiz object to the server for updating
          const updatedQuizResponse = await quizzesClient.updateQuiz(updatedQuiz);
      
          // Dispatch the action to update the quiz in Redux store
          dispatch(updateQuiz(updatedQuizResponse));

      
          // Optional: You can add a success message or further actions if needed
          console.log("Quiz published successfully");
        } catch (error) {
          console.error("Error publishing quiz:", error);
        }
      };

      const unpublishQuiz = async (quiz: any) => {

      
        try {
          // Create an updated quiz object with the 'published' field set to true
          const updatedQuiz = { ...quiz, published: false };
      
          // Send the updated quiz object to the server for updating
          const updatedQuizResponse = await quizzesClient.updateQuiz(updatedQuiz);
      
          // Dispatch the action to update the quiz in Redux store
          dispatch(updateQuiz(updatedQuizResponse));
      
          // Optional: You can add a success message or further actions if needed
          console.log("Quiz unpublished successfully");
        } catch (error) {
          console.error("Error unpublishing quiz:", error);
        }
      };


    return (
        <div className="float-end">
           {currentUser?.role === "STUDENT" && (
  <>
    {quiz.published ? (
      <div>
        <GreenCheckmark />
      </div>
    ) : (
        <div >
        <BsBanFill className="text-danger me-1" />
      </div>
    )}
  </>
)}

            {(currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN") && (
            <>
                {quiz.published && (
                    <span onClick={() => {unpublishQuiz(quiz)}}>
                        <GreenCheckmark />
                    </span>
                )}
                {!quiz.published && <BsBanFill className="text-danger me-1" onClick={() => {publishQuiz(quiz)}} />}
                <div className="dropdown float-end">
                <IoEllipsisVertical className="fs-4 dropdown-toggle no-shift" data-bs-toggle="dropdown"/>
                <ul className="dropdown-menu">
                    <li><a className="dropdown-item me-0" href={`#/Kanbas/Courses/${cid}/Quizzes/${quiz._id}/edit`}>Edit</a></li>
                    <li><button className="dropdown-item me-0" onClick={() => {removeQuizz()}}>Delete</button></li>
                    <li>{quiz.published && <button className="dropdown-item me-0" onClick={() => {unpublishQuiz(quiz)}}>Unpublish</button>}
                    {!quiz.published && <button className="dropdown-item me0" onClick={() => {publishQuiz(quiz)}}>Publish</button>}</li>
                </ul>
                </div>
            </>
            )}
        </div>
    );
}