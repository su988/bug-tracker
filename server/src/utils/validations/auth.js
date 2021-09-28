export const registerValidation = (username, password) => {
  const errors = {};

  if (
    !username ||
    username.trim() === '' ||
    username.length > 20 ||
    username.length < 3
  ) {
    errors.username = 'Username must be between 3-20 characters.';
  }

  if (!/^[a-zA-Z0-9-_]*$/.test(username)) {
    errors.username = 'Username must have alphanumeric characters only.';
  }

  if (!password || password.length < 6) {
    errors.password = 'Password must be atleast 6 characters long.';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const loginValidation = (username, password) => {
  const errors = {};

  if (!username || username.trim() === '') {
    errors.username = 'Username field cannot be empty.';
  }

  if (!password) {
    errors.password = 'Password field cannot be empty.';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
