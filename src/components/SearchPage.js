// SearchPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useCourseContext } from '../CourseContext'; // Import the context hook
import '../styles/SearchPage.css';

const SearchPage = () => {

  const navigate = useNavigate();
  useEffect(()=>{
      onAuthStateChanged(auth, (user) => {
          if (user) {

          } else {
            navigate("/login")
          }
        });
      
  }, [])

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { courses } = useCourseContext(); // Use the context hook to get the public courses data
  const publicCourses = courses.filter(course => course.isPublic);

  // Function to handle search input change
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to handle form submission
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Perform search based on searchQuery (e.g., fetch data from server)
    // For now, just filter predefined public courses based on searchQuery
    console.log(courses)
    const results = publicCourses.filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  return (
    <div className="search-container">
      <h2>Search Courses</h2>
      <div className="search-form">
        <input
          type="text"
          value={searchQuery}
          onKeyDown={(e) => {if (e.key === 'Enter') handleSearchSubmit(e)}}
          onChange={handleSearchInputChange}
          placeholder="Enter search term"
        />
        <button onClick={handleSearchSubmit}>Search</button>
      </div>
      <div className="search-results">
        {searchResults.map((course, index) => (
          <div className="course" key={index}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <Link to={`/courses/${course.id}`} className="course-link">View Course</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
