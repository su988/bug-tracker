import prisma from '../lib/prisma.js';

export const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    where: {
      id: {
        not: req.userId,
      },
    },
    select: {
      id: true,
      username: true,
    },
  });

  return res.json(users);
};
