import express from 'express';
import { createNote, updateNote, deleteNote } from '../controllers/note.js';
import authChecker from '../middlewares/authChecker.js';

const router = express.Router();

router.post('/:projectId/bugs/:bugId/notes', authChecker, createNote);
router.put('/:projectId/notes/:noteId', authChecker, updateNote);
router.delete('/:projectId/notes/:noteId', authChecker, deleteNote);

export default router;
