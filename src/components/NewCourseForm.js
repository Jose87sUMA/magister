// NewCourseForm.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useCourseContext } from '../CourseContext';
import { db } from '../firebase';
import { generateCourse } from '../IA/llamaAPI';
import '../styles/NewCourseForm.css';

const NewCourseForm = () => {
  const navigate = useNavigate();
  const { createCourse } = useCourseContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    experience: 'beginner',
    intensity: 'relaxed',
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
    });
  }, [navigate]);

  const user = auth.currentUser;

  const storeCourse = async (courseString) => {
    try {
      const docRef = await addDoc(collection(db, 'courses'), {
        courseString: courseString,
        userID: user.uid,
      });
      console.log('Document written with ID: ', docRef.id);
      createCourse({ courseString: courseString, courseID: docRef.id, userID: user.uid });
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const course = await generateCourse(formData.topic, formData.experience, formData.intensity);
      await storeCourse(course);
      navigate('/');
    } catch (error) {
      console.error('Error generating or storing course: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="loading-screen">
          <div className="loading-animation" aria-label="Loading"></div>
          <p>Creating course...</p>
        </div>
      ) : (
        <div>
          <div className="header-form">
            <Link to="/">
              <button>Go Back</button>
            </Link>
          </div>
          <form className="form-container" onSubmit={handleSubmit}>
            <label htmlFor="topic">Topic:</label>
            <input id="topic" name="topic" value={formData.topic} onChange={handleChange} required aria-required="true" />

            <label htmlFor="experience">Experience:</label>
            <select id="experience" name="experience" value={formData.experience} onChange={handleChange} required aria-required="true">
              <option value="beginner">Beginner</option>
              <option value="amateur">Amateur</option>
              <option value="experienced">Experienced</option>
              <option value="expert">Expert</option>
            </select>

            <label htmlFor="intensity">Intensity:</label>
            <select id="intensity" name="intensity" value={formData.intensity} onChange={handleChange} required aria-required="true">
              <option value="relaxed">Relaxed</option>
              <option value="standard">Standard</option>
              <option value="intensive">Intensive</option>
            </select>

            <button type="submit">Generate Course</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default NewCourseForm;
