import { createProjectValidation } from '../utils/validations/project.js';
import { prisma } from '../utils/config.js';

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

export const updateProject = async (req, res) => {};

export const deleteProject = async (req, res) => {};
