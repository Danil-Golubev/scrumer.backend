import mongoose from 'mongoose';
import { iUser, iTeam, Employee, ITask } from './Types';
import { UserSchema, TeamSchema, EmployeeSchema, TaskSchema } from './Schemes';

const User = mongoose.model<iUser>('User', UserSchema);
const Team = mongoose.model<iTeam>('Team', TeamSchema);
const Task = mongoose.model<ITask>('Task', TaskSchema);

export { User, Team, Task };
