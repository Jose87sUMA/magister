import React, { useState, useEffect } from 'react';
import { useLoaderData, useNavigate, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useCourseContext} from '../CourseContext'; // Import the context hook
import '../styles/Test.css';

const Test = () => {
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
  const { enrolledCourses, updateStage  } = useCourseContext(); // Use the context hook
  const [isSubmitted, setIsSubmitted] = useState(false);

  console.log(enrolledCourses);
  console.log(courseID);
  // Find the course data from the courses array using courseId
  const course = enrolledCourses.find(c => c.originalCourseID == courseID);

  if (!course) {
    return <div>Course not found</div>; // Render a message if the course is not found
  }

  const stage = course.courseJSON.stages.find(s => s.id == stageID);

  if (!stage) {
    return <div>Stage not found</div>; // Render a message if the course is not found
  }

  const questions = stage.questions;

  const evaluateSubmission = async (e) => {
    e.preventDefault();
    console.log("Submitting answers...");
  
    try {
      let score = 0;
      const totalQuestions = questions.length;
      const answers = document.querySelectorAll('input[type=radio]:checked');
  
      answers.forEach((answer, index) => {
        if (answer.value === questions[index].correctAnswer.toString()) {
          score++;
        }
      });
  
      const scorePercentage = (score / totalQuestions) * 100;
      console.log("Score percentage:", scorePercentage);
  
      // Update testScore in the stage object
      const updatedStage = { ...stage, testScore: scorePercentage };
  
      // Update the stage in the context
      updateStage(course, updatedStage);
  
      setIsSubmitted(true);
      // TODO: ADD A MESSAGE TO SHOW THE USER THE SCORE
      alert(`Test evaluated! You scored ${scorePercentage}%`)
    } catch (error) {
      console.error("Error submitting answers:", error);
      // Handle any errors here
    }
  };

  function handleKeyPress(e, questionIndex, answerIndex) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const radio = document.getElementById(`answer${questionIndex}-${answerIndex}`);
      if (radio) {
        radio.checked = true;
      }
    }
  }


  if (isSubmitted) {
    // Defer navigation after the component has finished rendering
    setTimeout(() => {
      navigate(`/courses/${course.originalCourseID}`);
    }, 0);  
    return null;
  }

  return (
    <div>
      <form className='form-test-container'>
        <div className="header-course">
          <button onClick={() => navigate(`/courses/${course.originalCourseID}`)} aria-label={"Go Back"}>Go Back</button>
        </div>
        <h3>{stage.title}</h3>
        {questions.map((question, index) => (
          <div key={index}>
            <label>{question.question}</label>
            {question.answers.map((answer, i) => (
              <div tabIndex="0" key={i} onKeyPress={(e) => handleKeyPress(e, index, i)}>
                <input type="radio" id={`answer${index}-${i}`} name={`question${index}`} value={i} className="radio-custom" />
                <label htmlFor={`answer${index}-${i}`} className="radio-label">{answer}</label>
              </div>
            ))}
          </div>
        ))}
        <button onClick={evaluateSubmission} type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Test;
