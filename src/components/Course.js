// Course.js
import React, { useState, useEffect } from 'react';
import { useLoaderData, Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db} from '../firebase';
import { addDoc,collection } from 'firebase/firestore';
import { FaFlag } from "react-icons/fa";
import { useCourseContext } from '../CourseContext'; // Import the context hook
import '../styles/Course.css';
import { set } from 'firebase/database';

export async function loader({ params }) {
  // No need to fetch the course data here, as it will be provided by the loader
  return { courseID: params.courseID };
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
  const { courseID } = useLoaderData();
  const { createdCourses, enrolledCourses, updateCreatedCourse, addEnrolledCourse } = useCourseContext(); // Use the context hook to get the courses data

  const handleStageClick = (index) => {
    setSelectedStage(index);
  };

  const handleClosePopup = () => {
    setSelectedStage(null);
  };

  const makeCoursePublic = () => {
    course.courseJSON.isPublic = true;
    updateCreatedCourse(course);
  }

  const enrollToCourse = async () => {
    // Add the course to the enrolledCourses collection in the database
    try {
      const docRef = await addDoc(collection(db, "enrolledCourses"), {
        courseString: JSON.stringify(course.courseJSON),
        userID: auth.currentUser.uid,
        originalCourseID: course.courseID
      });
      //update entry on db with the id of the course
      console.log("Document written with ID: ", docRef.id);
      course.originalCourseID =  course.courseID;
      course.courseID = docRef.id;
      addEnrolledCourse(course);
      setEnrolled(true);
      setCourse(course);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  // Find the course data from the courses array using courseId
  const [creator, setCreator] = useState(true);
  const [enrolled, setEnrolled] = useState(true);
  const [course, setCourse] = useState(null);
  
  useEffect(() => {
    // Check if the current course is in the enrolled courses
    let creatorCourse = createdCourses.find(c => c.courseID == courseID);

    if (!creatorCourse) {
      setCreator(false);
    }

    let enrolledCourse = enrolledCourses.find(c => c.originalCourseID == courseID);

    if (!enrolledCourse) {
      setEnrolled(false);
    }

    setCourse(enrolledCourse ? enrolledCourse : creatorCourse);

  }, [course]);

  if (!course) {
    return <div>Course not found</div>; // Render a message if the course is not found
  }

  return (
    <div className='course-details'>
      <div className="course-header">
        <Link to="/"><button>Go Back</button></Link>
        {creator && (!course.courseJSON.isPublic ? (
          <button className='make-public-button' onClick={makeCoursePublic}>Make Public</button>
        ):
        (
          <p className='course-public-text' disabled>Course is public</p>
        )
        )}
      </div>
      <h3>{course.courseJSON.title}</h3>
      <p>{course.courseJSON.description}</p>
      {
        enrolled ? (
          <p>{`Completiton Percentage: ${course.courseJSON.completionPercentage}%`}</p>
        ) : (
          <button onClick={enrollToCourse}>Enroll</button>
        )
      }
     
      <div className="map">
        <h4>Course Map</h4>
        <div className="flags">
          {course.courseJSON.stages.map((stage, index) => (
            <div
              key={index}
              className={`flag ${selectedStage === index ? 'selected' : ''} ${stage.completed ? 'completed' : 'incomplete'}`}
              onMouseEnter ={() => {console.log(stage.completed);handleStageClick(index)}}
              onMouseLeave={handleClosePopup}
              onClick={() => navigate(`/courses/${enrolled ? course.originalCourseID : course.courseID}/${stage.id}`)}
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
