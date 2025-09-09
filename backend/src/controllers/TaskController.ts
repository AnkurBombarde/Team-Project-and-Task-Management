import { Request, Response } from 'express';
import { Task } from '../models/Task';
import { ITask } from '../interfaces/ITask';

export class TaskController {
  static async getAllTasks(req: Request, res: Response): Promise<void> {
    try {
      const { 
        page = 1, 
        limit = 10,
        member,
        status,
        search,
        fromDate,
        toDate
      } = req.query;

      const query: any = {};

      if (member) query.assignedMembers = { $in: [member] };
      if (status) query.status = status;

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      if (fromDate || toDate) {
        query.deadline = {};
        if (fromDate) query.deadline.$gte = new Date(fromDate as string);
        if (toDate) query.deadline.$lte = new Date(toDate as string);
      }

      const options = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sort: { deadline: 1 },
        populate: ['assignedMembers']
      };

      // Use the correct paginate method
      const result = await Task.paginate(query, options);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks', error });
    }
  }

  static async createTask(req: Request, res: Response): Promise<void> {
    try {
      const task: ITask = await Task.create(req.body);
      const populatedTask = await Task.findById(task._id)
        .populate('assignedMembers');
      res.status(201).json(populatedTask);
    } catch (error) {
      res.status(400).json({ message: 'Error creating task', error });
    }
  }

  static async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const task = await Task.findByIdAndUpdate(id, req.body, { new: true })
        .populate('assignedMembers');
      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ message: 'Error updating task', error });
    }
  }

  static async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const task = await Task.findByIdAndDelete(id);
      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error deleting task', error });
    }
  }
}