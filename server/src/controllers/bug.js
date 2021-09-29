import { parse } from 'dotenv';
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
export const deleteBug = async (req, res) => {
  const { projectId, bugId } = req.params;

  const selectedProject = await prisma.project.findUnique({
    where: {
      id: parseInt(projectId),
    },
  });

  if (!selectedProject) {
    return res.status(404).send({ message: 'Invalid project ID' });
  }

  const selectedBug = await prisma.bug.findUnique({
    where: {
      id: parseInt(bugId),
    },
  });

  if (!selectedBug) {
    return res.status(404).send({ message: 'Invalid bug ID' });
  }

  if (
    selectedProject.ownerId !== req.userId &&
    selectedBug.createdById !== req.userId
  ) {
    return res.status(401).send({ message: 'Access is denied' });
  }

  await prisma.bug.delete({
    where: {
      id: parseInt(bugId),
    },
  });

  return res.status(204).end();
};

// ####################
// close bug in a project
// ####################
export const closeBug = async (req, res) => {
  const { projectId, bugId } = req.params;

  const selectedProject = await prisma.project.findUnique({
    where: {
      id: parseInt(projectId),
    },
    include: {
      members: true,
      bugs: {
        where: {
          id: parseInt(bugId),
        },
      },
    },
  });

  const memberIds = selectedProject.members.map((member) => member.memberId);

  if (!memberIds.includes(req.userId)) {
    return res.status(401).send({ message: 'Access is denied.' });
  }

  if (selectedProject.bugs.length === 0) {
    return res.status(400).send({ message: 'Invalid bug ID.' });
  }

  const selectedBug = await prisma.bug.findUnique({
    where: {
      id: parseInt(bugId),
    },
  });

  if (selectedBug.isResolved) {
    return res
      .status(400)
      .send({ message: 'Bug is already marked as closed.' });
  }

  await prisma.bug.update({
    where: {
      id: parseInt(bugId),
    },
    data: {
      isResolved: true,
      closedById: req.userId,
      closedAt: new Date(),
      updatedById: req.userId,
      updatedAt: new Date(),
      reopenedById: null,
      reopenedAt: null,
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
      closedBy: {
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

  res.send(updatedBug);
};

// ####################
// reopen bug in a project
// ####################
export const reopenBug = async (req, res) => {};
