import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ITeamMember } from '../interfaces/ITeamMember';

const TeamMemberSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  designation: { type: String, required: true }
}, { timestamps: true });

TeamMemberSchema.plugin(mongoosePaginate);

// Use the correct type for paginate
interface TeamMemberModel extends mongoose.PaginateModel<ITeamMember> {}

export const TeamMember: TeamMemberModel = mongoose.model<ITeamMember, TeamMemberModel>('TeamMember', TeamMemberSchema);
export default TeamMember;