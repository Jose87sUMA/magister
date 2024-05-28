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

  // TODO: SHOW MESSAGE/ALERT AFTER CREATION
  const handleSubmit = async e => {
    setLoading(true); 
    try {
      const course = await generateCourse(formData.topic, formData.experience, formData.intensity);
      await storeCourse(course);
      navigate('/');
    } catch (error) {
      console.error("Error generating or storing course: ", error);
      alert("Error creating course. Please try again.")
    } finally {
      setLoading(false);
      alert("Course created successfully!")
    }
  };

  const handleKeyDown = (e, name, value) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  return (
    <div>
      {loading ? (
        <div className="loading-screen">
          <div className="loading-animation" aria-label="Loading"></div>
          <p>Creando Curso...</p>
        </div>
      ) : (
        <div>
          <div className="header-form">
            <button onClick={() => navigate("/")} aria-label={"Volver"}>Volver</button>
          </div>
          <form className='form-container' onSubmit={handleSubmit}>
            <label tabIndex={0}>
              Tema:
              <input name="topic" value={formData.topic} onChange={handleChange} />
            </label>
            <label tabIndex={0}>
              <div className="tooltip">Experiencia:
                <span role='tooltip' className="tooltiptext">Experiencia se refiere a la competencia o familiaridad que tiene el usuario en el tema específico.</span>
              </div>
              <select name="experience" value={formData.experience} onChange={handleChange} onKeyDown={(e) => handleKeyDown(e, 'experience', e.target.value)} tabIndex="0">
                <option aria-label="Principiante" value="beginner">Principiante</option>
                <option aria-label="Amateur" value="amateur">Amateur</option>
                <option aria-label="Experimentado/a" value="experienced">Experimentado/a</option>
                <option aria-label="Experto/a" value="expert">Experto/a</option>
              </select>
            </label>
            <label tabIndex={0}>
              <div className="tooltip">Intensidad:
                <span role='tooltip' className="tooltiptext">La intensidad del curso se refiere a la cantidad de trabajo.</span>
              </div>
              <select name="intensity" value={formData.intensity} onChange={handleChange} onKeyDown={(e) => handleKeyDown(e, 'experience', e.target.value)} tabIndex="0">
                <option aria-label="Relajado" value="relaxed">Relajado</option>
                <option aria-label="Estándar" value="standard">Estándar</option>
                <option aria-label="Intensivo" value="intensive">Intensivo</option>
              </select>
            </label>
            <button type="submit" aria-label="Generar curso">Generar Curso</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default NewCourseForm;
