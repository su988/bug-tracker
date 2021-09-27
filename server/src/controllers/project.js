import pkg from '@prisma/client';
import { createProjectValidation } from '../utils/validations/project.js';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const getAllProjects = async (req, res) => {};

export const createProject = async (req, res) => {
  const { name } = req.body;
  const membersIds = req.body.members
    ? [re.userId, ...req.body.members]
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
    ownerId: req.userId,
  }));

  const newMembers = prisma.member.createMany({
    data: members,
  });
};

export const updateProject = async (req, res) => {};

export const deleteProject = async (req, res) => {};
