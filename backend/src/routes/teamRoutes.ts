import express from 'express';
import { TeamController } from '../controllers/TeamController';
import { validateTeamMember } from '../middlewares/validation';

const router = express.Router();

router.get('/', TeamController.getAllTeamMembers);
router.post('/', validateTeamMember, TeamController.createTeamMember);
router.put('/:id', validateTeamMember, TeamController.updateTeamMember);
router.delete('/:id', TeamController.deleteTeamMember);

export default router;