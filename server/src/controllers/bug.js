import prisma from '../lib/prisma.js';
import { checkBugValidation } from '../utils/validations/bug.js';

// ####################
// get all bugs for a project
// ####################
export const getBugs = async (req, res) => {
  const { projectId } = req.params;

  const selectedProject = await prisma.project.findUnique({
    where: {
      id: parseInt(projectId),
    },
    include: {
      members: true,
      bugs: {
        include: {
          createdBy: {
            select: {
              username: true,
            },
          },
          notes: {
            select: {
              body: true,
              author: {
                select: {
                  username: true,
                },
              },
            },
          },
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

// ####################
// create bug for a project
// ####################
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
      createdBy: {
        select: {
          username: true,
        },
      },
      notes: {
        select: {
          body: true,
          author: true,
        },
      },
    },
  });

  res.status(201).json(bug);
};

// ####################
// update bug in a project
// ####################
export const updateBug = async (req, res) => {
  const { title, description, priority } = req.body;
  const { projectId, bugId } = req.params;

  const { errors, valid } = checkBugValidation(title, description, priority);

  if (!valid) {
    return res.status(400).send({ error: Object.values(errors)[0] });
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

  const selectedBug = await prisma.bug.findUnique({
    where: {
      id: parseInt(bugId),
    },
  });

  if (!selectedBug) {
    return res.status(400).send({ message: 'Invalid bug ID.' });
  }

  await prisma.bug.update({
    where: {
      id: parseInt(bugId),
    },
    data: {
      title: title,
      description: description,
      priority: priority,
      updatedById: req.userId,
      updatedAt: new Date(),
    },
  });

  const updatedBug = await prisma.bug.findUnique({
    where: {
      id: parseInt(bugId),
    },
    include: {
      createdBy: {
        select: {
          username: true,
        },
      },
      updatedBy: {
        select: {
          username: true,
        },
      },
      notes: {
        select: {
          body: true,
          author: true,
        },
      },
    },
  });

  return res.status(201).json(updatedBug);
};

// ####################
// delete bug in a project
// ####################
export const deleteBug = async (req, res) => {};

// ####################
// close bug in a project
// ####################
export const closeBug = async (req, res) => {};

// ####################
// reopen bug in a project
// ####################
export const reopenBug = async (req, res) => {};
