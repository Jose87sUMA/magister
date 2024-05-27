// SearchPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useCourseContext } from '../CourseContext';
import '../styles/SearchPage.css';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { allCourses, fetchAllCourses } = useCourseContext();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
    });

    if (allCourses.length === 0) {
      fetchAllCourses();
    }
  }, [navigate, allCourses, fetchAllCourses]);

  const publicCourses = allCourses.filter(course => course.courseJSON.isPublic);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const results = publicCourses.filter(course =>
      course.courseJSON.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <div className="search-container">
      <h2 tabIndex={0}>Buscar Cursos</h2>
      <form className="search-form" onSubmit={handleSearchSubmit}>
        <label htmlFor="search-input" className="visually-hidden" tabIndex={0}>Search Courses</label>
        <input
          id="search-input"
          type="text"
          value={searchQuery}
          onChange={handleSearchInputChange}
          placeholder="Introduzca el término de búsqueda"
          aria-label="Introduzca el término de búsqueda"
          tabIndex={0}
        />
        <button type="submit" tabIndex={0}>Buscar</button>
      </form>
      <div className="search-results" aria-live="polite">
        {searchResults.map((course, index) => (
          <div className="course" key={index}>
            <h3 tabIndex={0}>{course.courseJSON.title}</h3>
            <p tabIndex={0}>{course.courseJSON.description}</p>
            <Link to={`/courses/${course.courseID}`} className="course-link" tabIndex={0}>Ver Curso</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
