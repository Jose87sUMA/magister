// App.js
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { CourseProvider } from './CourseContext';
import CourseList from './components/CourseList';
import Course, {loader as courseLoaderById} from './components/Course';
import Stage, {loader as stageLoaderById} from './components/Stage';
import Test from './components/Test';
import NewCourseForm from './components/NewCourseForm';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <CourseList />,
      children:[
        
      ]
    },
    {
      path: '/new-course',
      element: <NewCourseForm />
    },
    {
      path: '/courses/:courseId',
      element: <Course />,
      loader: courseLoaderById
    },
    {
      path: '/courses/:courseId/:stageId',
      element: <Stage />,
      loader: stageLoaderById
    },
    {
      path: '/courses/:courseId/:stageId/test',
      element: <Test />,
      loader: stageLoaderById
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
