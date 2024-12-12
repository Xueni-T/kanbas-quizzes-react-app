import { useEffect, useState } from "react";
import { FaPencil } from "react-icons/fa6";
import { FaCheck, FaUserCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { useParams, useNavigate } from "react-router";
import * as client from "../../Account/client";

export default function PeopleDetails() {
  const { uid } = useParams();
  const [user, setUser] = useState<any>({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [editing, setEditing] = useState({ firstName: false, lastName: false, email: false, role: false });
  const navigate = useNavigate();

  const deleteUser = async (uid: string) => {
    await client.deleteUser(uid);
    navigate(-1);
  };

  const fetchUser = async () => {
    if (!uid) return;
    const user = await client.findUserById(uid);
    setUser(user);
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setRole(user.role);
  };

  useEffect(() => {
    if (uid) fetchUser();
  }, [uid]);

  if (!uid) return null;

  const saveUser = async () => {
    const updatedUser = { ...user, firstName, lastName, email, role };
    await client.updateUser(updatedUser);
    setUser(updatedUser);
    setEditing({ firstName: false, lastName: false, email: false, role: false });
  };

  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
      <button onClick={() => navigate(-1)} className="btn position-fixed end-0 top-0 wd-close-details">
        <IoCloseSharp className="fs-1" />
      </button>
      <div className="text-center mt-2">
        <FaUserCircle className="text-secondary me-2 fs-1" />
      </div>
      <hr />
      <div className="text-danger fs-4">
        {!editing.firstName ? (
          <span onClick={() => setEditing({ ...editing, firstName: true })}>
            {firstName}
            <FaPencil className="ms-2 fs-6 wd-edit" />
          </span>
        ) : (
          <input
            className="form-control w-50 wd-edit-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveUser();
            }}
          />
        )}
      </div>
      <div className="text-danger fs-4 mt-2">
        {!editing.lastName ? (
          <span onClick={() => setEditing({ ...editing, lastName: true })}>
            {lastName}
            <FaPencil className="ms-2 fs-6 wd-edit" />
          </span>
        ) : (
          <input
            className="form-control w-50 wd-edit-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveUser();
            }}
          />
        )}
      </div>
      <div className="mt-1">
        <b>Email:</b>
        {!editing.email && (
          <span className="wd-email">
            {user.email}
            <FaPencil onClick={() => setEditing({ ...editing, email: true })}
              className="ms-2 fs-6 wd-edit" />
          </span>
        )}
        {editing.email && (
          <input
            type="email"
            className="form-control w-75 my-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveUser();
            }}
          />
        )}
      </div>
      <div className="mt-1">
        <b>Role:</b>
        {!editing.role && (
          <span className="wd-role">
            {user.role}
            <FaPencil onClick={() => setEditing({ ...editing, role: true })}
              className="ms-2 fs-6 wd-edit" />
          </span>
        )}
        {editing.role && (
          <select
            className="form-select w-75 my-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="STUDENT">Students</option>
            <option value="TA">Assistants</option> <option value="FACULTY">Faculty</option>
            <option value="ADMIN">Administrators</option>
          </select>
        )}
      </div>
      <hr />
      <b>Login ID:</b> <span className="wd-login-id">{user.loginId}</span> <br />
      <b>Section:</b> <span className="wd-section">{user.section}</span> <br />
      <b>Total Activity:</b> <span className="wd-total-activity">{user.totalActivity}</span>
      <hr />
      <button onClick={saveUser} className="btn btn-primary">Save</button>
      <button onClick={() => deleteUser(uid)} className="btn btn-danger float-end wd-delete">
        Delete
      </button>
      <button onClick={() => navigate(-1)} className="btn btn-secondary float-end me-2 wd-cancel">
        Cancel
      </button>
    </div>
  );
}