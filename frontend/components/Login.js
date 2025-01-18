// all necessary imports
import React, { useState } from 'react';
import '../styles/Form.css';
import { Link, useNavigate } from 'react-router-dom'; 
import { validateEmail, validatePassword } from '../utils/Validation'; 
import { loginUser } from '../api/tripApi';

// functional component to manage log in form (validation and authentication)
const LogIn = () => {
  // defining state variables and initialising them to empty strings (React feature)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
    loginError: ''
  });
  const navigate = useNavigate();

  // defining function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // calling imported functions and passing current value to them. returns empty if valid, error message if invalid
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

     // updating validationerrors with the strings above to display relevant errors, and keeping login error empty
     setValidationErrors({
      email: emailError,
      password: passwordError,
      loginError: ''
    });
    
    // if error strings are empty, proceeding with authentication
    if (!emailError && !passwordError) {
  
  try {
    const response = await loginUser(email, password); // api call to login

    if (response && response.user_id) {
      localStorage.setItem('userId', response.user_id); // save userId 
    
      navigate('/my-trips');
      console.log('Successful login:', response);
    } else {
      setValidationErrors((prevState) => ({
        ...prevState,
        loginError: 'Invalid credentials.'
      }));
    }
  } catch (error) {
    console.error('Login failed:', error);
    setValidationErrors((prevState) => ({
      ...prevState,
      loginError: 'An error occurred during log in. Please try again.'
    }));
  }
  };
  }
  // login form layout: contains input fields, and a submission button. the logic and styling followed is very similar as the one ofnsign up form
  return (
    <div className="form-page">
      <div className="left-side">
        <h1>planAtrip</h1>
        <p>The all-in-one travel companion</p>
      </div>
      <div className="right-side" style={{ paddingTop: '70px', paddingBottom: '50px' }}>
        <h2>Log in to your account:</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => setValidationErrors({ ...validationErrors, email: validateEmail(email) })}
              required
            />
            {validationErrors.email && <div className="error-message">{validationErrors.email}</div>}
            
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={() => setValidationErrors({ ...validationErrors, password: validatePassword(password) })}
              required
            />
            {validationErrors.password && <div className="error-message">{validationErrors.password}</div>}
          </div>

           {/* show login error if there is one */}
           {validationErrors.loginError &&  <div className="error-message">{validationErrors.loginError}</div>}

          <button type="submit">Log in</button>
        </form>
        <div className="action-link">
          <p>Don't have an account? <Link to="/signup">Sign up.</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
