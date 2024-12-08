import React from "react";
import DeleteEachAssign from "./deleteEachAssign";
import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
export default function EachAssignControl({
  assignmentId,
  setAssignmentToDelete,
}: {
  assignmentId: string;
  setAssignmentToDelete: (title: string) => void;
}) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  return (
    <div id="wd-assignments-controls" className="text-nowrap d-flex align-items-center">
      {currentUser?.role === "FACULTY" || currentUser.role === 'ADMIN' && (
        <>
          <FaTrash className="text-danger me-4 fs-4" data-bs-toggle="modal" data-bs-target="#wd-add-assignment-dialog"
            onClick={() => setAssignmentToDelete(assignmentId)} />
        </>
      )}
      <GreenCheckmark />
      <IoEllipsisVertical className="fs-3" />
    </div>
  );
}