import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { IProject } from '../interfaces/IProject';

export class ProjectController {
  static async getAllProjects(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query;
      const options = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sort: { createdAt: -1 },
        populate: 'teamMembers'
      };
      
      // Use the correct paginate method
      const result = await Project.paginate({}, options);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching projects', error });
    }
  }

  static async createProject(req: Request, res: Response): Promise<void> {
    try {
      const project: IProject = await Project.create(req.body);
      const populatedProject = await Project.findById(project._id).populate('teamMembers');
      res.status(201).json(populatedProject);
    } catch (error) {
      res.status(400).json({ message: 'Error creating project', error });
    }
  }

  static async updateProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const project = await Project.findByIdAndUpdate(id, req.body, { new: true }).populate('teamMembers');
      if (!project) {
        res.status(404).json({ message: 'Project not found' });
        return;
      }
      res.status(200).json(project);
    } catch (error) {
      res.status(400).json({ message: 'Error updating project', error });
    }
  }

  static async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const project = await Project.findByIdAndDelete(id);
      if (!project) {
        res.status(404).json({ message: 'Project not found' });
        return;
      }
      res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error deleting project', error });
    }
  }
}