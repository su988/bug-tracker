import prisma from '../lib/prisma.js';
import { checkBugValidation } from '../utils/validations/bug.js';

export const getBugs = async (req, res) => {
  const { projectId } = req.params;

  const selectedProject = await prisma.project.findUnique({
    where: {
      id: parseInt(projectId),
    },
    include: {
      members: true,
      bugs: true,
      bugs: {
        include: {
          notes: true,
        },
      },
    },
  });

  const currentMembers = selectedProject.members.map(
    (member) => member.memberId
  );

  const checkIfUserIsMember = currentMembers
    .map((memberId) => memberId)
    .includes(req.userId);

  if (!checkIfUserIsMember) {
    return res.status(401).send({ message: 'Access denied!' });
  }

  const bugs = {};
  bugs.bugs = selectedProject.bugs;

  res.json(bugs);
};

export const createBug = async (req, res) => {
  const { title, description, priority } = req.body;
  const { projectId } = req.params;

  const { errors, valid } = checkBugValidation(title, description, priority);

  if (!valid) {
    return res.status(400).send({ message: Object.values(errors)[0] });
  }

  const projectMembers = await prisma.member.findMany({
    where: {
      projectId: parseInt(projectId),
    },
    select: {
      memberId: true,
    },
  });

  const memberIds = projectMembers.map((member) => member.memberId);

  if (!memberIds.includes(req.userId)) {
    return res.status(401).send({ message: 'Access is denied.' });
  }

  const newBug = await prisma.bug.create({
    data: {
      title,
      description,
      priority,
      projectId: parseInt(projectId),
      createdById: req.userId,
    },
  });

  const bug = await prisma.bug.findUnique({
    where: {
      id: newBug.id,
    },
    include: {
      notes: true,
    },
  });

  res.send(bug);
};

export const updateBug = async (req, res) => {};

export const deleteBug = async (req, res) => {};

export const closeBug = async (req, res) => {};

export const reopenBug = async (req, res) => {};
