// import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import { Signin } from './pages/Signin'
// import { Signup } from './pages/Signup'
// import { Blog } from './pages/Blog'
// import {Blogs} from './pages/Blogs'
// import { Publish } from './pages/Publish'

// function App() {

//   return (
//     <>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/signin" element={<Signin />} />
//           <Route path="/blog/:id" element={<Blog />} />
//           <Route path="/blogs" element={<Blogs />} />
//           <Route path="/publish" element={<Publish />} />
//         </Routes>
//       </BrowserRouter>
//     </>
//   )
// }

// export default App

// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import { Signin } from './pages/Signin';
// import { Signup } from './pages/Signup';
// import { Blog } from './pages/Blog';
// import { Blogs } from './pages/Blogs';
// import { Publish } from './pages/Publish';
// import { ProtectedPath } from './components/ProtectedPath'; // make sure you import it

// function App() {
//   return (
//     <>
//       <BrowserRouter>
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/signin" element={<Signin />} />

//           {/* Protected Routes */}
//           <Route
//             path="/blog/:id"
//             element={
//               <ProtectedPath>
//                 <Blog />
//               </ProtectedPath>
//             }
//           />
//           <Route
//             path="/blogs"
//             element={
//               <ProtectedPath>
//                 <Blogs />
//               </ProtectedPath>
//             }
//           />
//           <Route
//             path="/publish"
//             element={
//               <ProtectedPath>
//                 <Publish />
//               </ProtectedPath>
//             }
//           />
//         </Routes>
//       </BrowserRouter>
//     </>
//   );
// }

// export default App;


import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Signin } from './pages/Signin';
import { Signup } from './pages/Signup';
import { Blog } from './pages/Blog';
import { Blogs } from './pages/Blogs';
import { Publish } from './pages/Publish';
import { ProtectedPath } from './components/ProtectedPath';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/signup" replace />} />

          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />

          {/* Protected Routes */}
          <Route
            path="/blog/:id"
            element={
              <ProtectedPath>
                <Blog />
              </ProtectedPath>
            }
          />
          <Route
            path="/blogs"
            element={
              <ProtectedPath>
                <Blogs />
              </ProtectedPath>
            }
          />
          <Route
            path="/publish"
            element={
              <ProtectedPath>
                <Publish />
              </ProtectedPath>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
