import pkg from '@prisma/client';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

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
