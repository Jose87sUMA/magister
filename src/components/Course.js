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
  }, [navigate])

  const [selectedStage, setSelectedStage] = useState(null);
  const { courseID } = useLoaderData();
  const { createdCourses, enrolledCourses, allCourses, fetchAllCourses, updateCreatedCourse, addEnrolledCourse } = useCourseContext(); // Use the context hook to get the courses data

  // Find the course data from the courses array using courseId
  const creator = createdCourses.find(c => c.courseID == courseID) !== undefined;
  const [enrolled, setEnrolled] = useState(true);
  const [course, setCourse] = useState(null);
  
  useEffect(() => {

    let enrolledCourse = enrolledCourses.find(c => c.originalCourseID == courseID);

    if (!enrolledCourse) {
      setEnrolled(false);
    }

  }, [enrolledCourses, courseID]);


  useEffect(() => {

    if (enrolled) {
      let course = enrolledCourses.find(c => c.originalCourseID == courseID);
      setCourse(course);
    }
    else if (creator){
      let course = createdCourses.find(c => c.courseID == courseID);
      setCourse(course);
    }
    else {
      let course = allCourses.find(c => c.courseID == courseID);
      setCourse(course);
    }

  }, [enrolledCourses, createdCourses, course, enrolled]);

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

  if (!course && allCourses.length === 0) {
    fetchAllCourses();
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>; // Render a message if the course is not found
  }


  return (
    <div className='course-details'>
      <div className="course-header">
        <button onClick={() => navigate("/")} aria-label={"Go Back"}>Go Back</button>
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
          <div>
            <p><b>Course Completion:</b> {course.courseJSON.completionPercentage}%</p>
            <p><b>Average:</b> {(course.courseJSON.stages.reduce((sum, stage) => sum + stage.testScore, 0) / course.courseJSON.stages.length).toFixed(0)}%</p>
          </div>
        ) : (
          <button className='enroll-button' onClick={enrollToCourse}>Enroll</button>
        )
      }
     
      <div className="map">
        <h4>Course Map</h4>
        <div className="flags">
          {course.courseJSON.stages.map((stage, index) => (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: '10px',
                justifyContent: 'center',
              }}>
                <div
                  key={index}
                  className='flag'
                  style={{
                    border: `solid rgba(${200 * (1 - (Math.max(0, stage.testScore - 50) / 50))},
                      ${200 * (Math.min(50, stage.testScore) / 50)},
                      0,
                      1)`,
                    minWidth: '40px',
                    maxWidth: '40px',
                    minHeight: '40px',
                    maxHeight: '40px',
                  }}
                >
                  <FaFlag
                    className='flag-icon'
                    style={{
                      color: `rgba(${200 * (1 - (Math.max(0, stage.testScore - 50) / 50))},
                      ${200 * (Math.min(50, stage.testScore) / 50)},
                      0,
                      1)`
                    }}
                  />
                </div>
                <div style={{display: 'flex', flexDirection: 'row', flexWrap:"wrap", width: "100%", justifyContent: "space-evenly"}}>
                <div style={{display: 'flex', flexDirection: 'column', textAlign: 'left', minWidth: "150px",maxWidth:"700px", marginLeft: `10px`}}>
                  <h3 style={{}}>{stage.title}</h3>
                  <p style={{marginTop: '0px'
                  }}>{stage.description}</p>
                </div>
                <div style={{
                  marginTop: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  marginLeft: '20px',
                  minWidth: "120px",
                }}>
                  <p>{`Test Score: ${stage.testScore}`}</p>
                  <button
                    style={{
                      height: '30px',
                      minWidth: '120px',
                      marginTop: 'auto',
                      marginBottom: '5px'
                    }}
                    onClick={() => navigate(`/courses/${enrolled ? course.originalCourseID : course.courseID}/${stage.id}`)}>
                    Access
                  </button>
                </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Course;
