import { Document } from 'mongoose';

export type TaskStatus = 'to-do' | 'in-progress' | 'done' | 'cancelled';

export interface ITask extends Document {
  title: string;
  description: string;
  deadline: Date;
  assignedMembers: string[];
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}