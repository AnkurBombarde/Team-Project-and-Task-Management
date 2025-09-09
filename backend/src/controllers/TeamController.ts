import { Request, Response } from 'express';
import { TeamMember } from '../models/Teams';
import { ITeamMember } from '../interfaces/ITeamMember';

export class TeamController {
  static async getAllTeamMembers(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query;
      const options = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sort: { createdAt: -1 }
      };
      
      // Use the correct paginate method
      const result = await TeamMember.paginate({}, options);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching team members', error });
    }
  }



  static async createTeamMember(req: Request, res: Response): Promise<void> {
    try {
      const teamMember: ITeamMember = await TeamMember.create(req.body);
      res.status(201).json(teamMember);
    } catch (error) {
      res.status(400).json({ message: 'Error creating team member', error });
    }
  }

  static async updateTeamMember(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const teamMember = await TeamMember.findByIdAndUpdate(id, req.body, { new: true });
      if (!teamMember) {
        res.status(404).json({ message: 'Team member not found' });
        return;
      }
      res.status(200).json(teamMember);
    } catch (error) {
      res.status(400).json({ message: 'Error updating team member', error });
    }
  }

  static async deleteTeamMember(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const teamMember = await TeamMember.findByIdAndDelete(id);
      if (!teamMember) {
        res.status(404).json({ message: 'Team member not found' });
        return;
      }
      res.status(200).json({ message: 'Team member deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error deleting team member', error });
    }
  }
}