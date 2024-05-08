import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { useCourseContext } from '../CourseContext'; // Import the context hook
import '../styles/CourseList.css';

const CourseList = () => {
  const { courses } = useCourseContext(); // Use the context hook to get the courses data
  return (
    <div className='course-container'>
      <h3>Tus cursos</h3>
      {courses.map((course, index) => (
        // only display if course.visible is true
        course.visible &&
          <div key={index}>
            <Link to={`/courses/${course.id}`}><button className='course-link'>{course.title}</button></Link>
            <div>
              <p>Description: {course.description}</p>
              <p>Stages: {course.stages.length}</p>
              <progress
                style={{
                  width: '100%',
                  accentColor: `rgba(${200*(1-(Math.max(0,course.completionPercentage-50)/50))}, 
                                     ${200*(Math.min(50,course.completionPercentage)/50)}, 
                                     0, 
                                     1)`,
                }}
                value={course.completionPercentage}
                max="100"
              />
            </div>
            <hr /> {/* Add a separator */}
          </div>
        
      ))}
      <Link to="/new-course"><button className='create-course-link'>{'Create New Course'}</button></Link> {/* Navigate to NewCourseForm */}
    </div>
    );
};

export default CourseList;
