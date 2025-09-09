export interface ITeamMember {
  _id: string;
  name: string;
  email: string;
  designation: string;
  createdAt: string;  
  updatedAt: string;   
}

export interface ITeamMemberFormData {
  name: string;
  email: string;
  designation: string;
}