import { Document } from 'mongoose';

export interface ITeamMember extends Document {
  name: string;
  email: string;
  designation: string;
  createdAt: Date;
  updatedAt: Date;
}