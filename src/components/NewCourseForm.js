// NewCourseForm.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { collection, addDoc, updateDoc } from 'firebase/firestore';
import { useCourseContext } from '../CourseContext';
import { db } from '../firebase';
import { generateCourse } from '../IA/llamaAPI';
import '../styles/NewCourseForm.css';

const NewCourseForm = () => {
  
  const navigate = useNavigate();
  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
        if (user) {

        } else {
          navigate("/login")
        }
      });
  } , [])

  const user = auth.currentUser;
  const { createCourse } = useCourseContext();

  const storeCourse = async (courseString) => {  
    try {
        const docRef = await addDoc(collection(db, "courses"), {
          courseString: courseString,    
          userID: user.uid,
        });
        //update entry on db with the id of the course
        console.log("Document written with ID: ", docRef.id);
        createCourse({courseString: courseString, courseID: docRef.id, userID: user.uid})

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  const [formData, setFormData] = useState({
    topic: '',
    experience: 'beginner',
    intensity: 'relaxed',
  });


  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    
    generateCourse(formData.topic, formData.experience, formData.intensity).then((course) => storeCourse(course));
    
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
          <input name="topic" value={formData.topic} onChange={handleChange} />
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
