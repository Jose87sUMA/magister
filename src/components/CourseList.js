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
      <div className='course-container'>
        <div className='course-list'>
          <div className='course-list-header'>
            <h3 id='enrolled-courses-heading' tabIndex={0}>Tus cursos inscritos</h3>
            <Link to='/search-courses' aria-label='Search course to enroll' tabIndex={0}>
              <FaPlus className='plus-icon' aria-hidden='true' />
            </Link>
          </div>
          <hr aria-hidden='true' />
          {enrolledCourses.map((course, index) => (
            course.courseJSON.visible && (
              <div key={index} className='course-item'>
                <p className='course-title' tabIndex={0}>{course.courseJSON.title}</p>
                <div>
                  <p tabIndex={0}>{course.courseJSON.description}</p>
                  <div className='course-item-footer'>
                    <p tabIndex={0}>Stages: {course.courseJSON.stages.length}</p>
                    <Link to={`/courses/${course.originalCourseID}`} tabIndex={-1}>
                      <button className='course-link' tabIndex={0}>Acceder</button>
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
                    aria-valuenow={course.courseJSON.completionPercentage}
                    aria-valuemin='0'
                    aria-valuemax='100'
                    aria-labelledby='enrolled-courses-heading'
                    tabIndex={0}
                  />
                  <hr aria-hidden='true' />
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      <div className='course-container'>
        <div className='course-list'>
          <div className='course-list-header'>
            <h3 id='created-courses-heading' tabIndex={0}>Tus cursos creados</h3>
            <Link to='/new-course' aria-label='Create new course' tabIndex={0}>
              <FaPlus className='plus-icon' aria-hidden='true' />
            </Link>
          </div>
          <hr aria-hidden='true' />
          {createdCourses.map((course, index) => (
            course.courseJSON.visible && (
              <div key={index} className='course-item'>
                <p className='course-title' tabIndex={0}>{course.courseJSON.title}</p>
                <div>
                  <p tabIndex={0}>{course.courseJSON.description}</p>
                  <div className='course-item-footer'>
                    <p tabIndex={0}>Stages: {course.courseJSON.stages.length}</p>
                    <Link to={`/courses/${course.courseID}`} tabIndex={-1}>
                      <button className='course-link' tabIndex={0}>Acceder</button>
                    </Link>
                  </div>
                </div>
                <hr aria-hidden='true' />
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseList;
