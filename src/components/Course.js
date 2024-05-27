// Course.js
import React, { useState, useEffect } from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { FaFlag } from "react-icons/fa";
import { useCourseContext } from '../CourseContext';
import '../styles/Course.css';

export async function loader({ params }) {
  return { courseID: params.courseID };
}

const Course = () => {
  const navigate = useNavigate();
  const { courseID } = useLoaderData();
  const [selectedStage, setSelectedStage] = useState(null);
  const [enrolled, setEnrolled] = useState(true);
  const [course, setCourse] = useState(null);

  const { createdCourses, enrolledCourses, allCourses, fetchAllCourses, updateCreatedCourse, addEnrolledCourse } = useCourseContext();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/login");
    });
  }, [navigate]);

  useEffect(() => {
    let enrolledCourse = enrolledCourses.find(c => c.originalCourseID == courseID);
    if (!enrolledCourse) setEnrolled(false);
  }, [enrolledCourses, courseID]);

  useEffect(() => {
    let course;
    if (enrolled) {
      course = enrolledCourses.find(c => c.originalCourseID == courseID);
    } else if (createdCourses.find(c => c.courseID == courseID)) {
      course = createdCourses.find(c => c.courseID == courseID);
    } else {
      course = allCourses.find(c => c.courseID == courseID);
    }
    setCourse(course);
  }, [enrolledCourses, createdCourses, course, enrolled]);

  const handleStageClick = (index) => setSelectedStage(index);
  const handleClosePopup = () => setSelectedStage(null);

  const makeCoursePublic = () => {
    course.courseJSON.isPublic = true;
    updateCreatedCourse(course);
  }

  const enrollToCourse = async () => {
    try {
      const docRef = await addDoc(collection(db, "enrolledCourses"), {
        courseString: JSON.stringify(course.courseJSON),
        userID: auth.currentUser.uid,
        originalCourseID: course.courseID
      });
      course.originalCourseID = course.courseID;
      course.courseID = docRef.id;
      addEnrolledCourse(course);
      setEnrolled(true);
      setCourse(course);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  if (!course && allCourses.length === 0) {
    fetchAllCourses();
    return <div>Cargando...</div>;
  }

  if (!course) {
    return <div>Curso no encontrado</div>;
  }

  return (
    <div className='course-details'>
      <div className="course-header">
        <Link to="/" tabIndex={-1}><button tabIndex={0}>Volver</button></Link>
        {createdCourses.find(c => c.courseID == courseID) && (
          !course.courseJSON.isPublic ? (
            <button className='make-public-button' onClick={makeCoursePublic} tabIndex={0}>Hacer Público</button>
          ) : (
            <p className='course-public-text' tabIndex={0}>Este curso es público</p>
          )
        )}
      </div>
      <h3 tabIndex={0}>{course.courseJSON.title}</h3>
      <p tabIndex={0}>{course.courseJSON.description}</p>
      {enrolled ? (
        <p tabIndex={0}>{`Porcentaje Completado: ${course.courseJSON.completionPercentage}%`}</p>
      ) : (
        <button className='enroll-button' onClick={enrollToCourse} tabIndex={0}>Inscribirse</button>
      )}
      <div className="map">
        <h4 tabIndex={0}>Mapa del Curso</h4>
        <div className="flags">
          {course.courseJSON.stages.map((stage, index) => (
            <div
              key={index}
              className={`flag ${selectedStage === index ? 'selected' : ''} ${stage.completed ? 'completed' : 'incomplete'}`}
              onMouseEnter={() => handleStageClick(index)}
              onMouseLeave={handleClosePopup}
              onClick={() => navigate(`/courses/${enrolled ? course.originalCourseID : course.courseID}/${stage.id}`)}
              aria-label={`Etapa ${index + 1}: ${stage.title}`}
              tabIndex={0}
            >
              <FaFlag className='flag-icon' aria-hidden='true' />
              {selectedStage === index && (
                <div className="popup">
                  <h5 tabIndex={0}>{stage.title}</h5>
                  <p tabIndex={0}>{stage.description}</p>
                  <p tabIndex={0}>{`Puntuación: ${stage.testScore}`}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Course;
