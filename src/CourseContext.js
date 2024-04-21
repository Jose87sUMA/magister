// CourseContext.js
import React, { createContext, useState, useContext, useEffect} from 'react';
import initialCourses from './data/courses.json';

// Create the context
const CourseContext = createContext();

// Create a provider component
export const CourseProvider = ({ children }) => {
    const [courses, setCourses] = useState(() => {
      // Get courses from local storage, or use default if not present
      const storedCourses = localStorage.getItem('courses');
      return storedCourses ? JSON.parse(storedCourses) : initialCourses;
    });
  
    // Update local storage when courses state changes
    useEffect(() => {
      localStorage.setItem('courses', JSON.stringify(courses));
    }, [courses]);

  // Update the completion percentage for a course
  const updateCompletionPercentage = (course) => {
    const completedStages = course.stages.filter(stage => stage.completed);
    const completionPercentage = (completedStages.length / course.stages.length) * 100;
    course.completionPercentage = completionPercentage;
    return course;
  };

  // Complete a stage if the test score is greater or equal to 50
  const completeStageIfScoreIs50 = (stage) => {
    if (stage.testScore >= 50) {
        stage.completed = true;
    }
    return stage
  };

  const updateCourse = (course) => {
    course = updateCompletionPercentage(course);
    setCourses(prevCourses => prevCourses.map(c => {
      if (c.id === course.id) {
        return course;
      }
      return c;
    }));
  };

  const updateStage = (course, stage) => {
    stage = completeStageIfScoreIs50(stage);
    // reusing updateCourse function 
    const updatedCourse = {
      ...course,
      stages: course.stages.map(s => {
        if (s.id === stage.id) {
          return stage;
        }
        return s;
      })
    };
    updateCourse(updatedCourse);
  };

  // Wrap the functions to be passed down through context
  const contextValue = {
    courses,
    updateCourse,
    updateStage
  };

  return (
    <CourseContext.Provider value={contextValue}>
      {children}
    </CourseContext.Provider>
  );
};

// Custom hook to consume the context
export const useCourseContext = () => useContext(CourseContext);
