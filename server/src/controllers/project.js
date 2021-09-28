import {
  createProjectValidation,
  checkProjectName,
} from '../utils/validations/project.js';
import { prisma } from '../utils/config.js';

// ####################
// get all projects where current user is a member
// ####################
export const getAllProjects = async (req, res) => {
  const projects = await prisma.project.findMany({
    where: {
      members: {
        some: {
          memberId: req.userId,
        },
      },
    },
    include: {
      members: true,
      bugs: true,
    },
  });

  res.json(projects);
};

// ####################
// create new project and add members to project
// ####################
export const createProject = async (req, res) => {
  const { name } = req.body;
  const membersIds = req.body.members
    ? [req.userId, ...req.body.members]
    : [req.userId];

  const { errors, valid } = createProjectValidation(name, membersIds);

  if (!valid) {
    return res.status(400).send({ message: Object.values(errors)[0] });
  }

  const newProject = await prisma.project.create({
    data: {
      name,
      ownerId: req.userId,
    },
  });

  const members = membersIds.map((memberId) => ({
    memberId: memberId,
    projectId: newProject.id,
  }));

  const newMembers = await prisma.member.createMany({
    data: members,
  });

  const createdProject = await prisma.project.findUnique({
    where: {
      id: newProject.id,
    },
    include: {
      members: true,
      bugs: true,
    },
  });

  return res.json(createdProject);
};

// ####################
// update selected project
// ####################
export const updateProjectName = async (req, res) => {
  const { name } = req.body;
  const { projectId } = req.params;

  const nameValidationError = checkProjectName(name);

  if (nameValidationError) {
    return res.status(400).send({ message: nameValidationError });
  }

  const updatedProject = await prisma.project.update({
    where: {
      id: parseInt(projectId),
    },
    data: {
      name,
    },
  });

  res.send(updatedProject);
};

export const deleteProject = async (req, res) => {
  const { projectId } = req.params;

  const selectedProject = await prisma.project.delete({
    where: {
      id: parseInt(projectId),
    },
  });

  // if (!selectedProject) {
  //   return res.status(404).send({ message: 'Invalid project ID.' });
  // }

  // if (selectedProject.ownerId !== req.userId) {
  //   return res.status(401).send({ message: 'Access is denied.' });
  // }
};
