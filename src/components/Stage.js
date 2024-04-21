// Stage.js
import React from 'react';
import { courses } from '../data/courses';
import { Link, useLoaderData } from 'react-router-dom';
import { useCourseContext } from '../CourseContext'; // Import the context hook
import '../styles/Stage.css';

export async function loader({ params }) {
  return { courseId: params.courseId, stageId: params.stageId };
}

const Stage = () => {
  const { courseId, stageId } = useLoaderData();
  const { courses } = useCourseContext(); // Use the context hook to get the courses data

  // Find the course data from the courses array using courseId
  const course = courses.find(c => c.id == courseId);

  if (!course) {
    return <div>Course not found</div>; // Render a message if the course is not found
  }

  const stage = course.stages.find(s => s.id == stageId);

  if (!stage) {
    return <div>Stage not found</div>; // Render a message if the course is not found
  }

  return (
    <div className='course-details'>
      <div className="header-course">
        <Link to={`/courses/${course.id}`}><button>Go Back</button></Link>
      </div>
      <h3>{stage.title}</h3>
      <h5>{stage.description}</h5>
      <p>{stage.content}</p>
      <Link to={`/courses/${course.id}/${stage.id}/test`}><button className='take-test-button'>Take Test</button></Link>
    </div>
  );
};

export default Stage;
