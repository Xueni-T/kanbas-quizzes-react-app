import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { enrollCourse, unenrollCourse, setEnrollments } from "./enrollmentReducer";
import * as enrollmentClient from "./enrollmentClient";
import * as userClient from "./Account/client";
import * as courseClient from "./Courses/client";
export default function Dashboard(
  { courses, course, setCourse,
    deleteCourse, updateCourse, enrolling, setEnrolling, updateEnrollment }: {
      courses: any[]; course: any; setCourse: (course: any) => void;
      addNewCourse: () => void; deleteCourse: (course: any) => void;
      updateCourse: () => void; enrolling: boolean; setEnrolling: (enrolling: boolean) => void;
      updateEnrollment: (courseId: string, enrolled: boolean) => void
    }) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentReducer);
  const dispatch = useDispatch();
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const isFaculty = currentUser?.role === "FACULTY" || currentUser.role === 'ADMIN';
  const fetchEnrolledCourses = async () => {
    try {
      const enrolledCourses = await userClient.findMyCourses();
      console.log("Enrolled courses fetched:", enrolledCourses);
      const updatedEnrollments = enrolledCourses.map((course: any) => ({
        _id: course._id,
        user: currentUser._id,
        course: course._id,
      }));
      // Update Redux state with the new enrollments
      dispatch(setEnrollments(updatedEnrollments));
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchEnrolledCourses();
    }
  }, [currentUser]);

  const addNewCourse = async () => {
    try {
      const newCourse = await userClient.createCourse(course);
      setCourse({ _id: "", name: "", number: "", startDate: "", endDate: "", image: "reactjs.jpg", description: "" });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard
        <button onClick={() => setEnrolling(!enrolling)} className="float-end btn btn-primary" >
          {enrolling ? "My Courses" : "All Courses"}
        </button>
      </h1> <hr />
      {isFaculty && (
        <>
          <h5>
            New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={addNewCourse}
            >
              Add
            </button>
            <button
              className="btn btn-warning float-end me-2"
              onClick={updateCourse}
              id="wd-update-course-click"
            >
              Update
            </button>
          </h5>
          <br />
          <input
            value={course.name}
            className="form-control mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <textarea
            value={course.description}
            className="form-control"
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
          />
          <hr />
          <hr /><br /> </>)}

      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2> <hr />
      <div id="wd-dashboard-courses" className="row">
        <div className="row row-cols-1 row-cols-md-5 g-4">
          {courses.map((course) => (
            <div className="wd-dashboard-course col" style={{ width: "300px" }}>
              <div className="card rounded-3 overflow-hidden">
                <Link to={(!enrolling || course.enrolled) ? `/Kanbas/Courses/${course._id}/Home` : '/Kanbas/Dashboard'}
                  className="wd-dashboard-course-link text-decoration-none text-dark" >
                  <img src={`/images/${course.image}`} width="100%" height={160} />
                  <div className="card-body">
                    <h5 className="wd-dashboard-course-title card-title">
                      {enrolling && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            updateEnrollment(course._id, !course.enrolled);
                          }}
                          className={`btn ${course.enrolled ? "btn-danger" : "btn-success"} float-end`} >
                          {course.enrolled ? "Unenroll" : "Enroll"}
                        </button>
                      )}
                      {course.name} </h5>
                    <p className="wd-dashboard-course-title card-text overflow-y-hidden" style={{ maxHeight: 100 }}>
                      {course.description} </p>
                    {(currentUser.role == "FACULTY" || course.enrolled || !enrolling) && (
                      <button className="btn btn-primary"> Go </button>)
                    }

                    {isFaculty && (
                      <>
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            deleteCourse(course._id);
                          }}
                          className="btn btn-danger float-end"
                          id="wd-delete-course-click"
                        >
                          Delete
                        </button>
                        <button
                          id="wd-edit-course-click"
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(course);
                          }}
                          className="btn btn-warning me-2 float-end"
                        >
                          Edit
                        </button> </>)}
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}