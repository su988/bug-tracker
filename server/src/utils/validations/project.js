export const checkProjectName = (name) => {
  if (!name || name.trim() === '') {
    return 'Project name cannot be empty';
  }

  if (name.length > 60) {
    return 'Project name length must not be more than 60';
  }
};

const checkProjectMembers = (members) => {
  if (!Array.isArray(members)) {
    return 'Members field must be an array.';
  }

  if (members.filter((m, i) => members.indexOf(m) !== i).length !== 0) {
    return 'Members field must not have duplicate IDs.';
  }
};

export const createProjectValidation = (name, members) => {
  const errors = {};
  const nameError = checkProjectName(name);
  const memebersError = checkProjectMembers(members);

  if (nameError) {
    errors.name = nameError;
  }

  if (memebersError) {
    errors.members = memebersError;
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
