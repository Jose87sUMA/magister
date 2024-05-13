import React, {useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useCourseContext } from '../CourseContext'; // Import the context hook
import { FaPlus  } from "react-icons/fa";
import '../styles/CourseList.css';

const CourseList = () => {
  const navigate = useNavigate();
  useEffect(()=>{
      onAuthStateChanged(auth, (user) => {
          if (user) {

          } else {
            navigate("/login")
          }
        });
      
  }, [])


  const { courses } = useCourseContext(); // Use the context hook to get the courses data
  return (
    <div className='course-container'>
      <div className='course-list-header'>
        <h3>Tus cursos</h3>
        <Link to="/new-course">{<FaPlus className='plus-icon'/>} </Link>
      </div>
    {/* Navigate to NewCourseForm */}
      <hr /> {/* Add a separator */}
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
          </div>
        
      ))}
    </div>
    );
};

export default CourseList;
