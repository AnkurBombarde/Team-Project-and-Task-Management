import { Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  teamMembers: string[];
  createdAt: Date;
  updatedAt: Date;
}