import prisma from '../lib/prisma.js';
import { checkProjectMembers } from '../utils/validations/project.js';

// ####################
// add members to project
// ####################
export const addProjectMembers = async (req, res) => {
  const memberIds = req.body.members || [];
  const { projectId } = req.params;

  if (memberIds.length === 0) {
    return res.status(400).send({ message: 'Members field is empty' });
  }

  const selectedProject = await prisma.project.findUnique({
    where: {
      id: parseInt(projectId),
    },
    include: {
      members: true,
    },
  });

  if (!selectedProject) {
    return res.status(404).send({ message: 'Invalid project id' });
  }

  if (selectedProject.ownerId !== req.userId) {
    return res.status(401).send({ message: 'Access is denied' });
  }

  const currentMembers = selectedProject.members.map(
    (member) => member.memberId
  );

  const memberValidation = checkProjectMembers([
    ...currentMembers,
    ...memberIds,
  ]);

  if (memberValidation) {
    return res.status(400).send({ message: memberValidation });
  }

  const newMembers = memberIds.map((memberId) => ({
    memberId,
    projectId: parseInt(projectId),
  }));

  await prisma.member.createMany({
    data: newMembers,
  });

  const updatedMembers = await prisma.member.findMany({
    where: {
      projectId: parseInt(projectId),
    },
    include: {
      member: {
        select: {
          username: true,
        },
      },
    },
  });

  res.send(updatedMembers);
};

// ####################
// remove member from project
// ####################
export const removeProjectMember = async (req, res) => {
  const { projectId, memberId } = req.params;

  const selectedProject = await prisma.project.findUnique({
    where: {
      id: parseInt(projectId),
    },
    include: {
      members: true,
    },
  });

  if (!selectedProject) {
    return res.status(404).send({ message: 'Invalid project ID.' });
  }

  if (selectedProject.ownerId !== req.userId) {
    return res.status(401).send({ message: 'Access is denied.' });
  }

  if (selectedProject.ownerId === memberId) {
    return res
      .status(400)
      .send({ message: "Project creator can't be removed." });
  }

  if (
    !selectedProject.members
      .map((member) => member.memberId)
      .includes(parseInt(memberId))
  ) {
    return res.status(404).send({
      message: 'Member not found.',
    });
  }

  await prisma.member.delete({
    where: {
      projectId_memberId: {
        memberId: parseInt(memberId),
        projectId: parseInt(projectId),
      },
    },
  });

  res.status(204).end();
};

// ####################
// leave project as a member
// ####################
export const leaveProjectAsMember = async (req, res) => {
  const { projectId } = req.params;

  const selectedProject = await prisma.project.findUnique({
    where: {
      id: parseInt(projectId),
    },
    include: {
      members: true,
    },
  });

  if (!selectedProject) {
    return res.status(404).send({ message: 'Invalid project ID.' });
  }

  if (selectedProject.ownerId === req.userId) {
    return res.status(400).send({ message: "Project creator can't leave." });
  }

  if (
    !selectedProject.members
      .map((member) => member.memberId)
      .includes(req.userId)
  ) {
    return res.status(404).send({
      message: "You're not a member of the project.",
    });
  }

  await prisma.member.delete({
    where: {
      projectId_memberId: {
        memberId: parseInt(req.userId),
        projectId: parseInt(projectId),
      },
    },
  });

  res.status(204).end();
};
