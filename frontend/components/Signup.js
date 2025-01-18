// importing necessary components
import React, { useState } from 'react'; 
import '../styles/Form.css'; 
import { Link , useNavigate } from 'react-router-dom'; 
import { validateUsername, validateEmail, validatePassword, validateConfirmPassword } from '../utils/Validation'; 
import { registerUser } from '../api/tripApi';

// functional component to manage signup form 
const SignUp = () => {
  // defining state variables and initialising them to empty strings 
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({ // validationerrors stores messages for each input if they fail validation
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState(''); // for displaying error messages when registering
  const [successMessage, setSuccessMessage] = useState(''); // for displaying success message
  const navigate = useNavigate();

  // function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); 

    // returns empty if valid, error message if invalid
    const usernameError = validateUsername(username);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(password, confirmPassword);

    // updating validationerrors with the strings above to display relevant errors
    setValidationErrors({
      username: usernameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError
    });

    // if error strings are empty, preparing the data for registration 
    if (!usernameError && !emailError && !passwordError && !confirmPasswordError) {
      const data = {
        username,
        email,
        password,
        created_at: new Date().toISOString(), 
      };
      
      //  attempting to send the data
      try {
        const response = await registerUser(data);

        if (response && response.user_id) {

          // this is where we will simply navigate to the user details page when this is implemented 

        }
        else {

          // handling a potential backend failure in registration
          setErrorMessage('Registration failed. Please try again.');
        }
      } catch (error) {
         // handling external issues ex. network problem
        console.error('Error during registration:', error);
        setErrorMessage('Registration failed. Please try again.');
      }
    
      setSuccessMessage('You have successfully registered. Happy planning!');
      // redirecting user to log in page
      navigate('/login');

    }
  };

  // signup page layout: contains input fields and a registration button
  return (
    <div className="form-page"> 
      <div className="left-side"> 
        <h1>planAtrip</h1>
        <p>The all-in-one travel companion</p>
      </div>
      <div className="right-side"> 
        <h2>Create an account:</h2>
        {/* calling function when submission button is pressed*/}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username} // binding username state
              onChange={(event) => setUsername(event.target.value)} //updating username as the user types
              onBlur={() => setValidationErrors({ ...validationErrors, username: validateUsername(username) })} // validating username when user clicks off field
              required
            />
            {validationErrors.username && <div className="error-message">{validationErrors.username}</div>} {/* conditional rendering expression: if invalid, displaying error message, otherwise skipping the rendering */}
          </div>
          <div>
            {/* following same pattern for other fields */}
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
          <div>
            <label>Re-enter password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              onBlur={() => setValidationErrors({ ...validationErrors, confirmPassword: validateConfirmPassword(password, confirmPassword) })}
              required
            />
            {validationErrors.confirmPassword && <div className="error-message">{validationErrors.confirmPassword}</div>}
          </div>
          <button type="submit">Sign Up</button> {/* triggering form submission */}

          {/* success or error message displayed */}
          {errorMessage && <div className='error-message'>{errorMessage}</div> } 
          {successMessage && <div className='success-message'>{successMessage}</div> }
          
        </form>
        <div className="action-link">
          <p>Already have an account? <Link to="/login">Log In.</Link></p> {/* directing to login page upon click  */}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
