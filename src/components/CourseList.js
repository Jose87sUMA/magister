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

  useEffect(() => {
    console.log(enrolledCourses);
    console.log(createdCourses); 
  },[enrolledCourses, createdCourses]);

  return (
    <div className='course-list-page'>
      {/* Enrolled Courses */}
      <div className='course-container'>
        <div className='course-list'>
          <div className='course-list-header'>
            <h3>Tus cursos inscritos</h3>
            <Link to='/search-courses' aria-label='search course to enroll'>
              <FaPlus className='plus-icon' />
            </Link>
          </div>
          <hr />
          {enrolledCourses.map((course, index) => (
            course.courseJSON.visible && (
              <div key={index} className='course-item'>
                <p className='course-title'>{course.courseJSON.title}</p>
                <div>
                  <p>{course.courseJSON.description}</p>
                  <div className='course-item-footer'>
                    <p>Stages: {course.courseJSON.stages.length}</p>
                    <Link to={`/courses/${course.originalCourseID}`}>
                      <button button className='course-link'>Access</button>
                    </Link>
                  </div>
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
                  <hr />
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
            <Link to='/new-course' aria-label='create course'>
              <FaPlus className='plus-icon' />
            </Link>
          </div>
          <hr />
          {createdCourses.map((course, index) => (
            course.courseJSON.visible && (
              <div key={index} className='course-item'>
                <p className='course-title'>{course.courseJSON.title}</p>
                <div>
                  <p>{course.courseJSON.description}</p>
                  <div className='course-item-footer'>
                    <p>Stages: {course.courseJSON.stages.length}</p>
                    <Link to={`/courses/${course.courseID}`}>
                      <button button className='course-link'>Access</button>
                    </Link>
                  </div>
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
