import { prisma } from '../utils/config.js';

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

  res.send(bugs);
};

export const createBug = async (req, res) => {};

export const updateBug = async (req, res) => {};

export const deleteBug = async (req, res) => {};

export const closeBug = async (req, res) => {};

export const reopenBug = async (req, res) => {};
