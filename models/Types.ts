import { Document, Schema } from 'mongoose';
export interface iUser extends Document {
	firstName: string;
	lastName: string;
	email: string;
	tgId: string;
	passwordHash: string;
	team: Schema.Types.ObjectId | null; // Указывает на команду
}
export type Employee = {
	user: Schema.Types.ObjectId; // Ссылка на пользователя
	position: string; // Роль в команде
};
export interface ITask {
	performer: Schema.Types.ObjectId; // ID сотрудника
	title: string;
	description: string;
	status: 'todo' | 'in_progress' | 'done';
	deadline: Date;
}

export interface iTeam extends Document {
	title: string;
	description: string;
	members: Employee[]; // Список участников с ролями
	deadline: Date; // Дата завершения проекта
	sprintDuration: number; // Длительность спринта в днях (7 или 14)
	tasks: ITask[];
}
