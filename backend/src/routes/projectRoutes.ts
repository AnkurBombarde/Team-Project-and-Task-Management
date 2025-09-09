import express from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { validateProject } from '../middlewares/validation';

const router = express.Router();

router.get('/', ProjectController.getAllProjects);
router.post('/', validateProject, ProjectController.createProject);
router.put('/:id', validateProject, ProjectController.updateProject);
router.delete('/:id', ProjectController.deleteProject);

export default router;