import { BsGripVertical } from 'react-icons/bs';
import AssignmentsControls from './AssignmentsControls';
import AssignmentsControlButtons from './AssignmentsControlButtons';
import EachAssignControl from './EachAssignControl';
import EachAssignHead from './EachAssignHead';
import { RxTriangleDown } from "react-icons/rx";
import { useParams, Link } from "react-router-dom";
import * as db from "../../Database";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, updateAssignment, deleteAssignment } from "./reducer";
export default function Assignments() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const [assignmentToDelete, setAssignmentToDelete] = useState("");
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const confirmDeleteAssignment = () => {
    dispatch(deleteAssignment(assignmentToDelete));
    setAssignmentToDelete("");
  };
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  return (
    <div>
      <AssignmentsControls />
      <ul id="wd-assignments" className="list-group rounded-0">
        <li className="wd-assignment list-group-item p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center fs-4">
              <BsGripVertical className="me-2 fs-3" />
              <RxTriangleDown className="me-2 fs-5" />
              <span><strong>ASSIGNMENTS</strong></span>
            </div>
            <AssignmentsControlButtons />
          </div>
          <ul className="wd-assign-list list-group rounded-0">
            {assignments
              .filter((assignment: any) => assignment.course === cid)
              .map((assignment: any) => (
                <li className="wd-each-assign list-group-item p-3 ps-1 d-flex align-items-center justify-content-between">
                  <EachAssignHead />
                  <div className="flex-grow-1 ms-4">
                    <p className="wd-each-assign-list-item mb-0">
                        {currentUser?.role === 'FACULTY' ? (
                        <Link to={`/Kanbas/Courses/${cid}/Assignments/${assignment._id}`} className="wd-assignment-link custom-link fs-4">
                          {assignment.title}
                        </Link>
                        ) : (
                        <span className="fs-4"><strong>{assignment.title}</strong></span>
                        )}<br />
                      <div className='fs-5'>
                        <span className="text-danger">Multiple Modules</span> <span>| </span> 
                        <strong>Due</strong> {new Date(assignment.dueDate).toLocaleString('en-US',
                          { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                          <span> | </span> {assignment.points} pts </div>
                        <strong>Not available until</strong> {new Date(assignment.availableDate).toLocaleString('en-US',
                          { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                        <span> | </span> <strong>Available until</strong> {new Date(assignment.untilDate).toLocaleString('en-US',
                          { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                    </p>
                  </div>
                  <EachAssignControl
                    deleteAssignment={confirmDeleteAssignment}
                    assignmentId={assignment._id}
                    setAssignmentToDelete={setAssignmentToDelete}
                  />
                </li>
              ))}
          </ul>
        </li>
      </ul>
    </div>

  );
}