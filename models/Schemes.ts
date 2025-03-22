import mongoose, { Schema } from 'mongoose';
import { iUser, iTeam, Employee, ITask } from './Types';

export const UserSchema = new Schema<iUser>({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	tgId: { type: String },
	passwordHash: { type: String, required: true },
	team: { type: Schema.Types.ObjectId, ref: 'Team', default: null }, // Пользователь может не состоять в команде
});

export const EmployeeSchema = new Schema<Employee>({
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	position: { type: String, required: true },
});

export const TaskSchema = new Schema<ITask>({
	team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
	performer: {
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		position: { type: String, required: true },
	},
	title: { type: String, required: true },
	description: { type: String, required: true },
	status: { type: String, enum: ['open', 'in_progress', 'closed', 'postponed'], default: 'open' },
	deadline: { type: Date, required: true },
});

export const TeamSchema = new Schema<iTeam>({
	title: { type: String, required: true },
	description: { type: String },
	members: [EmployeeSchema], // Встроенная схема для удобства
	deadline: { type: Date, required: true }, // Дата завершения проекта
	sprintDuration: { type: Number, enum: [7, 14], required: true }, // 7 или 14 дней
	tasks: [{ type: Schema.Types.ObjectId, ref: 'Task', required: true }], // Храним задачи прямо в команде
});
