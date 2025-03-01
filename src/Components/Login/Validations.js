export const validateSignup = (signupData, setValidationErrors) => {
  let errors = {};

  if (!signupData.name.trim()) {
    errors.name = "Full Name is required";
  }

  if (!signupData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
    errors.email = "Enter a valid email";
  }

  if (!signupData.password.trim()) {
    errors.password = "Password is required";
  } else if (signupData.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  setValidationErrors(errors);
  return Object.keys(errors).length === 0;
};

export const validateLogin = (loginData, setValidationErrors) => {
  let errors = {};

  if (!loginData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
    errors.email = "Enter a valid email";
  }

  if (!loginData.password.trim()) {
    errors.password = "Password is required";
  }

  setValidationErrors(errors);
  return Object.keys(errors).length === 0;
};
