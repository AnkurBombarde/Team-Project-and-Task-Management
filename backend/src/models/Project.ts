import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IProject } from '../interfaces/IProject';

const ProjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  teamMembers: [{ type: Schema.Types.ObjectId, ref: 'TeamMember' }]
}, { timestamps: true });

ProjectSchema.plugin(mongoosePaginate);

// Use the correct type for paginate
interface ProjectModel extends mongoose.PaginateModel<IProject> {}

export const Project: ProjectModel = mongoose.model<IProject, ProjectModel>('Project', ProjectSchema);
export default Project;