import express from 'express';
import authChecker from '../middlewares/authChecker.js';
import {
  addProjectMembers,
  removeProjectMember,
  leaveProjectAsMember,
} from '../controllers/members.js';

const router = express.Router();

router.post('/:projectId/members', authChecker, addProjectMembers);
router.delete(
  '/:projectId/members/:memberId',
  authChecker,
  removeProjectMember
);
router.post('/:projectId/members/leave', authChecker, leaveProjectAsMember);

export default router;
