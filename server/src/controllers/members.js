import { prisma } from '../utils/config.js';
import { checkProjectMembers } from '../utils/validations/project.js';

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

export const removeProjectMember = () => {};

export const leaveProjectAsMember = () => {};
