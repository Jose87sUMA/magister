import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useCourseContext } from '../CourseContext';
import { FaPlus } from 'react-icons/fa';
import '../styles/CourseList.css';

const CourseList = () => {
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
    });
  }, [navigate]);

  const { enrolledCourses, createdCourses } = useCourseContext();

  return (
    <div className='course-list-page'>
      {/* Enrolled Courses */}
      <div className='course-container'>
        <div className='course-list'>
          <div className='course-list-header'>
            <h3>Tus cursos inscritos</h3>
            <Link to='/search-courses'>
              <FaPlus className='plus-icon' />
            </Link>
          </div>
          <hr />
          {enrolledCourses.map((course, index) => (
            course.courseJSON.visible && (
              <div key={index} className='course-item'>
                <Link to={`/courses/${course.originalCourseID}`}>
                  <button className='course-link'>{course.courseJSON.title}</button>
                </Link>
                <div>
                  <p>{course.courseJSON.description}</p>
                  <p>Stages: {course.courseJSON.stages.length}</p>
                  <progress
                    style={{
                      width: '100%',
                      accentColor: `rgba(${200 *
                        (1 -
                          (Math.max(0, course.courseJSON.completionPercentage - 50) / 50))},
                                      ${200 *
                                        (Math.min(
                                          50,
                                          course.courseJSON.completionPercentage
                                        ) / 50)},
                                      0,
                                      1)`,
                    }}
                    value={course.courseJSON.completionPercentage}
                    max='100'
                  />
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Created Courses */}
      <div className='course-container'>
        <div className='course-list'>
          <div className='course-list-header'>
            <h3>Tus cursos creados</h3>
            <Link to='/new-course'>
              <FaPlus className='plus-icon' />
            </Link>
          </div>
          <hr />
          {createdCourses.map((course, index) => (
            course.courseJSON.visible && (
              <div key={index} className='course-item'>
                <Link to={`/courses/${course.courseID}`}>
                  <button className='course-link'>{course.courseJSON.title}</button>
                </Link>
                <div>
                  <p>{course.courseJSON.description}</p>
                  <p>Stages: {course.courseJSON.stages.length}</p>
                </div>
                <hr />
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseList;
