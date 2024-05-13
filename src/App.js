// App.js
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { CourseProvider } from './CourseContext';
import Header from './components/Header';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import CourseList from './components/CourseList';
import Course, {loader as courseLoaderById} from './components/Course';
import Stage, {loader as stageLoaderById} from './components/Stage';
import Test from './components/Test';
import NewCourseForm from './components/NewCourseForm';
import SearchPage from './components/SearchPage';

const router = createBrowserRouter(
  [
    {
      path: '/login',
      element : <Login />
    },
    {
      path: '/signup',
      element : <Signup />
    },
    {
      path: '/',
      element: (
        <>
          <Header />
          <CourseList />
        </>
      ),
      children: []
    },
    {
      path: '/new-course',
      element: (
        <>
          <Header />
          <NewCourseForm />
        </>
      ),
    },
    {
      path: '/courses/:courseId',
      element: (
        <>
          <Header />        
          <Course />,
        </>
      ),
      loader: courseLoaderById
    },
    {
      path: '/courses/:courseId/:stageId',
      element: (
        <>
          <Header />        
          <Stage />,
        </>
      ),
      loader: stageLoaderById
    },
    {
      path: '/courses/:courseId/:stageId/test',
      element: (
        <>
          <Header />        
          <Test />
        </>
      ),
      loader: stageLoaderById
    },
    {
      path: 'search-courses',
      element: (
        <>
          <Header />        
          <SearchPage />
        </>
      ),
      loader: courseLoaderById
    }
  ]
);

const App = () => {
  return (
    <CourseProvider>
      <RouterProvider router={router} />
    </CourseProvider>
  );
}

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<CourseList courses={courses} />} />
//         <Route path="/new-course" element={<NewCourseForm />} />
//         <Route path="/course/:id" element={<Course />} />
//       </Routes>
//     </Router>
//   );
// };

export default App;
