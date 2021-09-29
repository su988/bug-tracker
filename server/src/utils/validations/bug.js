export const checkBugValidation = (title, description) => {
  const errors = {};
  const validPriorities = ['low', 'medium', 'high'];

  if (!title || title.trim() === '' || title.length > 60 || title.length < 3) {
    errors.title = 'Title must be in range of 3-60 characters length.';
  }

  if (!description || description.trim() === '') {
    errors.description = 'Description field must not be empty.';
  }

  // if (!priority || !validPriorities.includes(priority)) {
  //   errors.priority = 'Priority can only be - low, medium or high.';
  // }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
