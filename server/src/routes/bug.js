import express from 'express';
import {
  closeBug,
  deleteBug,
  getBugs,
  reopenBug,
  updateBug,
} from '../controllers/bug.js';
import authChecker from '../middlewares/authChecker.js';

const router = express.Router();

router.get('/:projectId/bugs', authChecker, getBugs);
router.post('/:projectId/bugs/:bugId', authChecker, updateBug);
router.delete('/:projectId/bugs/:bugId', authChecker, deleteBug);
router.post('/:projectId/bugs/:bugId/close', authChecker, closeBug);
router.post('/:projectId/bugs/:bugId/reopen', authChecker, reopenBug);

export default router;
