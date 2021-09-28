import express from 'express';
import auth from '../middlewares/authChecker.js';
import {
  createProject,
  deleteProject,
  getAllProjects,
  updateProjectName,
} from '../controllers/project.js';

const router = express.Router();

router.get('/', auth, getAllProjects);
router.post('/', auth, createProject);
router.put('/:projectId', auth, updateProjectName);
router.delete('/:projectId', auth, deleteProject);

export default router;
