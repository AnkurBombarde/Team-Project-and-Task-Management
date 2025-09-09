import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const teamMemberSchema = Joi.object({
  name: Joi.string().required().min(3).max(50),
  email: Joi.string().email().required(),
  designation: Joi.string().required().min(3).max(50)
});

const projectSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  description: Joi.string().required().min(10).max(500),
  teamMembers: Joi.array().items(Joi.string().hex().length(24))
});

const taskSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().required().min(10).max(500),
  deadline: Joi.date().required().greater('now'),
  assignedMembers: Joi.array().items(Joi.string().hex().length(24)),
  status: Joi.string().valid('to-do', 'in-progress', 'done', 'cancelled')
});

export const validateTeamMember = (req: Request, res: Response, next: NextFunction) => {
  const { error } = teamMemberSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export const validateProject = (req: Request, res: Response, next: NextFunction) => {
  const { error } = projectSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

export const validateTask = (req: Request, res: Response, next: NextFunction) => {
  const { error } = taskSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};