import mongoose from 'mongoose';
import { iUser, iTeam, Employee } from './Types';
import { UserSchema, TeamSchema, EmployeeSchema } from './Schemes';

const User = mongoose.model<iUser>('User', UserSchema);
const Team = mongoose.model<iTeam>('Team', TeamSchema);

export { User, Team };
