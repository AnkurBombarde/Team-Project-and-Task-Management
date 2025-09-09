
export interface ITask {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  assignedMembers: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}


export interface ITaskFormData {
  title: string;
  description: string;
  deadline: string;
  assignedMembers: string[];
  status: string;
}
