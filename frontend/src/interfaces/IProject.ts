export interface IProject {
  _id: string;
  name: string;
  description: string;
  teamMembers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IProjectFormData {
  name: string;
  description: string;
  teamMembers: string[];
}
