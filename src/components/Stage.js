// Stage.js
import React, { useEffect, useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useCourseContext } from '../CourseContext';
import '../styles/Stage.css';

export async function loader({ params }) {
  return { courseID: params.courseID, stageID: params.stageID };
}

const Stage = () => {
  const navigate = useNavigate();
  const { courseID, stageID } = useLoaderData();
  const { enrolledCourses, allCourses, fetchAllCourses } = useCourseContext();

  const [enrolled, setEnrolled] = useState(true);
  const [course, setCourse] = useState(null);
  const [stage, setStage] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/login");
    });
  }, [navigate]);

  useEffect(() => {
    let enrolledCourse = enrolledCourses.find(c => c.originalCourseID == courseID);
    if (!enrolledCourse) setEnrolled(false);

    let allCourse = allCourses.find(c => c.courseID == courseID);
    const course = enrolledCourse ? enrolledCourse : allCourse;
    if (!course) return;

    setCourse(course);
    setStage(course.courseJSON.stages.find(s => s.id == stageID));
  }, [enrolledCourses, course, allCourses, stageID]);

  if (!allCourses.length) {
    fetchAllCourses();
    return <div className="loading-message" tabIndex={0}>Cargando...</div>;
  }

  if (!stage) {
    return <div className="loading-message" tabIndex={0}>Etapa no encontrada</div>;
  }

  return (
    <div className='course-details'>
      <div className="stage-header">
        <Link to={`/courses/${enrolled ? course.originalCourseID : course.courseID}`} tabIndex={-1}><button tabIndex={0}>Go Back</button></Link>
      </div>
      <h3 tabIndex={0}>{stage.title}</h3>
      <h5 tabIndex={0}>{stage.description}</h5>
      <p tabIndex={0}>{stage.content}</p>
      {enrolled ? (
        <Link to={`/courses/${course.originalCourseID}/${stage.id}/test`} tabIndex={-1}>
          <button className='take-test-button' tabIndex={0}>Take Test</button>
        </Link>
      ) : (
        <div>
          <p className='error-text' tabIndex={0}>You must first enroll to this course to take the test.</p>
          <button className='take-test-button-disabled' disabled tabIndex={0}>Take Test</button>
        </div>
      )}
    </div>
  );
};

export default Stage;
