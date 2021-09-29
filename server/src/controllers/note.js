import prisma from '../lib/prisma.js';

// ####################
// create note in bug
// ####################
export const createNote = async (req, res) => {
  const { body } = req.body;
  const { projectId, bugId } = req.params;

  if (!body || body.trim() === '') {
    return res.status(400).send({ message: 'Note body field cannot be empty' });
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

  const newNote = await prisma.note.create({
    data: {
      body,
      authorId: parseInt(req.userId),
      bugId: parseInt(bugId),
    },
  });

  const note = await prisma.note.findUnique({
    where: {
      id: newNote.id,
    },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
  });

  res.status(201).json(note);
};

// ####################
// update note in bug
// ####################
export const updateNote = async (req, res) => {
  const { body } = req.body;
  const { projectId, noteId } = req.params;

  if (!body || body.trim() === '') {
    return res.status(400).send({ message: 'Note body field cannot be empty' });
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

  const selectedNote = await prisma.note.findUnique({
    where: {
      id: parseInt(noteId),
    },
  });

  if (!selectedNote) {
    return res.status(404).send({ message: 'Invalid note id' });
  }

  if (selectedNote.authorId !== req.userId) {
    return res.status(401).send({ message: 'Access denied!' });
  }

  const updatedNote = await prisma.note.update({
    where: {
      id: parseInt(noteId),
    },
    data: {
      body,
      updatedAt: new Date(),
    },
  });

  res.json(updatedNote);
};

// ####################
// delete note in bug
// ####################
export const deleteNote = async (req, res) => {
  const { projectId, noteId } = req.params;

  const selectedProject = await prisma.project.findUnique({
    where: {
      id: parseInt(projectId),
    },
    include: {
      members: true,
    },
  });

  if (!selectedProject) {
    return res.status(404).send({ message: 'Invalid project ID' });
  }

  const memberIds = selectedProject.members.map((member) => member.memberId);

  if (!memberIds.includes(req.userId)) {
    return res.status(401).send({ message: 'Access is denied.' });
  }

  const selectedNote = await prisma.note.findUnique({
    where: {
      id: parseInt(noteId),
    },
  });

  if (!selectedNote) {
    return res.status(404).send({ message: 'Invalid note id' });
  }

  if (selectedNote.authorId !== req.userId) {
    return res.status(401).send({ message: 'Access denied!' });
  }

  await prisma.note.delete({
    where: {
      id: parseInt(noteId),
    },
  });

  res.status(204).end();
};
