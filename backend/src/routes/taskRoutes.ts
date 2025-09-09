import express from 'express';
import { TaskController } from '../controllers/TaskController';
import { validateTask } from '../middlewares/validation';

const router = express.Router();

router.get('/', TaskController.getAllTasks);
router.post('/', validateTask, TaskController.createTask);
router.put('/:id', validateTask, TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

export default router;