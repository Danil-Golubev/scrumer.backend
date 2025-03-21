import express from 'express';
import mongoose from 'mongoose';
import { createTeamValidation, registerValidation } from './utils/validations';
import { authMe, login, register } from './requests/UserRequests';
import { createTeam, getMyTeam, joinTeam } from './requests/TeamRequests';
import { changeTask, createTask, deleteTask, taskStatusChange } from './requests/TaskRequests';
import checkAuth from './utils/checkAuth';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
mongoose
	.connect(process.env.API_KEY as string)
	.then(() => {
		console.log('db  ok');
	})
	.catch((err) => {
		console.log('db error', err);
	});
app.use(express.json());
app.use(cors());
app.listen(4444, () => {
	console.log('server ok');
});
// User Запросы
app.get('/auth/me', checkAuth, authMe); // Проверка наличия токена
app.post('/auth/login', login); // Авторизация
app.post('/auth/register', registerValidation, register); // Регистрация

// Team Запросы
app.post('/team/create', checkAuth, createTeamValidation, createTeam); // Создание команды
app.post('/team/join/:id', checkAuth, joinTeam); // Присоединиться к команде
app.get('/team/getMyTeam', checkAuth, getMyTeam); // Просмотр своей команды

// Task Запросы
app.post('/task/create', checkAuth, createTask); // Присоединиться к команде
app.post('/task/statuschange', checkAuth, taskStatusChange);
app.post('/task/update', checkAuth, changeTask);
app.post('/task/delete', checkAuth, deleteTask);
// app.post('/task/update', checkAuth, createTask); // Присоединиться к команде
