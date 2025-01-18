// defining validation functions

// username validation (error if none provided or requirements not met) 
export const validateUsername = (username) => {
    if (!username) {
        return 'Username is required';
    }
    const usernamePattern = /^[a-zA-Z0-9_-]{3,20}$/;

  if (!usernamePattern.test(username)) {
    return 'Username must be 3-20 characters, and cannot contain spaces or special characters.';
  }

  return ''; 
};

// email validation (error if none provided or regex pattern not matched) 
export const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
        return 'Email is required';
    }
    if (!emailPattern.test(email)) {
        return 'Please enter a valid email';
    }
    return '';
};

// password validation (error if none provided or requirement not met)
export const validatePassword = (password) => {
    if (!password) {
        return 'Password is required';
    }
    if (password.length < 6) {
        return 'Password must be at least 6 characters';
    }
    return '';
};

// confirm password validation (error if does not match password field)
export const validateConfirmPassword = (password, confirmPassword) => {
    if (confirmPassword !== password) {
        return 'Passwords do not match';
    }
    return '';
};

// trip details validation (destination, startDate, endDate)
export const validateTrip = (trip) => {
    const { destination, startDate, endDate } = trip;
  
    if (!destination) {
      return 'Destination is required';
    }
  
    if (!startDate) {
      return 'Start date is required';
    }
  
    if (!endDate) {
      return 'End date is required';
    }
  
    if (new Date(startDate) > new Date(endDate)) {
      return 'Start date must be before the end date';
    }
  
    return ''; // No error if validation passed
  };

  
  