// Stage.js
import React, {useEffect, useState} from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useCourseContext } from '../CourseContext'; // Import the context hook
import '../styles/Stage.css';

export async function loader({ params }) {
  return { courseID: params.courseID, stageID: params.stageID };
}

const Stage = () => {

  const navigate = useNavigate();
  useEffect(()=>{
      onAuthStateChanged(auth, (user) => {
          if (user) {

          } else {
            navigate("/login")
          }
        });
      
  }, [])

  const { courseID, stageID } = useLoaderData();
  const { allCourses, enrolledCourses } = useCourseContext(); // Use the context hook to get the courses data
  console.log(enrolledCourses)

  // Find the course data from the courses array using courseId
  const [enrolled, setEnrolled] = useState(true);
  const [course, setCourse] = useState(null);
  const [stage, setStage] = useState(null);
  
  useEffect(() => {
    // Check if the current course is in the enrolled courses
    
    let enrolledCourse = enrolledCourses.find(c => c.originalCourseID == courseID);
    console.log(enrolledCourse);

    if (!enrolledCourse) {
      setEnrolled(false);
    }

    let allCourse = allCourses.find(c => c.courseID == courseID);

    if (!allCourse) {
    }

    setCourse(enrolledCourse ? enrolledCourse : allCourse);
    setStage(course.courseJSON.stages.find(s => s.id == stageID));

  }, []);

  if (!stage) {
    return <div>Stage not found</div>; // Render a message if the course is not found
  }

  return (
    <div className='course-details'>
      <div className="stage-header">
        <Link to={`/courses/${enrolled ? course.originalCourseID:course.courseID}`}><button>Go Back</button></Link>
      </div>
      <h3>{stage.title}</h3>
      <h5>{stage.description}</h5>
      <p>{stage.content}</p>
      {enrolled ? (
        <Link to={`/courses/${course.originalCourseID}/${stage.id}/test`}><button className='take-test-button'>Take Test</button></Link>
      ) : (
        <div>
          <p className='error-text'>You must first enroll to this course to take the test.</p>
          <button className='take-test-button-disabled' disabled>Take Test</button>
        </div>
      )}
    </div>
  );
};

export default Stage;
