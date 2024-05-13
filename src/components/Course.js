// Course.js
import React, { useState, useEffect } from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { FaFlag } from "react-icons/fa";
import { useCourseContext } from '../CourseContext'; // Import the context hook
import '../styles/Course.css';

export async function loader({ params }) {
  // No need to fetch the course data here, as it will be provided by the loader
  return { courseId: params.courseId };
}

const Course = () => {
  const navigate = useNavigate();
  useEffect(()=>{
      onAuthStateChanged(auth, (user) => {
          if (user) {

          } else {
            navigate("/login")
          }
        });
      
  }, [])

  const [selectedStage, setSelectedStage] = useState(null);
  const { courseId } = useLoaderData();
  const { courses } = useCourseContext(); // Use the context hook to get the courses data

  // Find the course data from the courses array using courseId
  const course = courses.find(c => c.id == courseId);

  if (!course) {
    return <div>Course not found</div>; // Render a message if the course is not found
  }

  const handleStageClick = (index) => {
    setSelectedStage(index);
  };

  const handleClosePopup = () => {
    setSelectedStage(null);
  };

  return (
    <div className='course-details'>
      <div className="header-course">
        <Link to="/"><button>Go Back</button></Link>
      </div>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <p>{`Completiton Percentage: ${course.completionPercentage}%`}</p>
      <div className="map">
        <h4>Course Map</h4>
        <div className="flags">
          {course.stages.map((stage, index) => (
            <div
              key={index}
              className={`flag ${selectedStage === index ? 'selected' : ''} ${stage.completed ? 'completed' : 'incomplete'}`}
              onMouseEnter ={() => {console.log(stage.completed);handleStageClick(index)}}
              onMouseLeave={handleClosePopup}
              onClick={() => navigate(`/courses/${course.id}/${stage.id}`)}
            >
              <FaFlag className='flag-icon'/>
              {selectedStage === index && (
                <div className="popup">
                  <h5>{stage.title}</h5>
                  <p>{stage.description}</p>
                  <p>{`Test Score: ${stage.testScore}`}</p>
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
