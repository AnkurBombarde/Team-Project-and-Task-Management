import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ITask, TaskStatus } from '../interfaces/ITask';

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
  // project field removed
  assignedMembers: [{ type: Schema.Types.ObjectId, ref: 'TeamMember' }],
  status: { 
    type: String, 
    enum: ['to-do', 'in-progress', 'done', 'cancelled'],
    default: 'to-do'
  }
}, { timestamps: true });

TaskSchema.plugin(mongoosePaginate);

// Use the correct type for paginate
interface TaskModel extends mongoose.PaginateModel<ITask> {}

export const Task: TaskModel = mongoose.model<ITask, TaskModel>('Task', TaskSchema);
export default Task;