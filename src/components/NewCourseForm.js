// NewCourseForm.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourseContext } from '../CourseContext'; // Import the context hook
import '../styles/NewCourseForm.css';

const NewCourseForm = () => {
  const [formData, setFormData] = useState({
    topic: '',
    experience: 'beginner',
    intensity: 'relaxed',
  });

  const { courses, updateCourse } = useCourseContext();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    let course;
    let id;
    if(formData.topic === 'CookieBaking') {
      id = 2;
    }
    else if(formData.topic === 'Physics') {
      id = 3;
    }
    else if(formData.topic === 'PrimarySchoolScience') {
      id = 4;
    }
    else {
      id = 1;
    }
    course = courses.find(c => c.id == id);
    course.visible = true;
    updateCourse(course);
    
  };


  return (
    <div>
      <div className="header-form">
        <Link to="/"><button>Go Back</button></Link> 
      </div>
      <form className='form-container' onSubmit={handleSubmit}>
        <label>
          Topic:
          {/* <input type="text" name="topic" value={formData.topic} onChange={handleChange} />  */}
          <select name="topic" value={formData.topic} onChange={handleChange}>
            <option value="React">Programación en React</option>
            <option value="CookieBaking">Hornear Galletas</option>
            <option value="Physics">Física</option>
            <option value="PrimarySchoolScience">Ciencia para estudiantes de Primaria</option>
          </select> 
        </label>
        <label>
          Experience:
          <select name="experience" value={formData.experience} onChange={handleChange}>
            <option value="beginner">Beginner</option>
            <option value="amateur">Amateur</option>
            <option value="experienced">Experienced</option>
            <option value="expert">Expert</option>
          </select>      
        </label>
        <label>
          Intensity:
          <select name="intensity" value={formData.intensity} onChange={handleChange}>
            <option value="relaxed">Relaxed</option>
            <option value="standard">Standard</option>
            <option value="intensive">Intensive</option>
          </select>
        </label>
        <Link to="/"><button type="submit" onClick={handleSubmit}>Generate Course</button></Link>
      </form>
    </div>

  );
};

// Prompt for AI API
const generateCoursePrompt = (topic, experience, intensity) => {
    return `Generate course on ${topic} for ${experience} users with ${intensity} intensity. The result must have the following format of a json:
    {
      "title": "Course Title",
      "description": "Course Description", //synopsis of the course
      "completionPercentage": 0, //initial value
      "stages": [
        {
          "id": 1, //unique identifier from 1 to n stages
          "title": "Stage Title", // title of the topic
          "description": "Stage Description", //synopsis of the topic
          "content": "", //full content of the stage. must be extensive text with all the content the user needs to know at their level on the topic. it must be adequate to the experience and intensity, also must have coherence with the other stages. after reading what you write on this section the user must be able to understand the topic. write the full content, dont skip anything on this section, be as extensive as needed.
          "completed": false, //initial value
          "testScore": 0, //initial value
          "questions": /*array of questions related to the content of the stage*/ [
            {
              "question": "Question", //question related to the content of the stage
              "answers": ["Answer 1", "Answer 2", "Answer 3", "Answer 4"], //array of possible answers, only one correct
              "correctAnswer": 0, //index of the correct answer
            },
            // define around 5 - 10 questions per stage that are not too easy or too difficult and not too similar to each other
          ],
        }
        // define around 5 stages that are sequential and coherent with the topic
      ]
    }`;
  };
  

export default NewCourseForm;
