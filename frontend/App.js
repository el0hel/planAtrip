import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';  

// Importing components
import SignUp from './components/Signup';
import LogIn from './components/Login';
import UserPage from './components/Userpage';
import Mytrips from './components/Mytrips';


function App() {
  return (
    <Router>
      <Routes>
        {/* redirecting root URL to the signup page */}
        <Route path="/" element={<Navigate to="/signup" />} />
        
        {/* defining routes */}
        <Route path="/signup" element={<SignUp />} />
         <Route path="/login" element={<LogIn />} /> 
        <Route path="/user" element={<UserPage />} />
        <Route path="/my-trips" element={<Mytrips />} /> 
      </Routes>
    </Router>
  );
}

export default App;
