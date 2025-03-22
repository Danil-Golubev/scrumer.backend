import { Task, Team, User } from '../models/Models';
import { ObjectId, Schema } from 'mongoose';
export const createTask = async (req, res) => {
	try {
		const { title, team, performer, description, status, deadline } = req.body;

		// Создание новой задачи
		const task = new Task({
			title,
			team,
			performer,
			description,
			status,
			deadline,
		});

		// Сохранение задачи
		const savedTask = await task.save();

		// Поиск команды и добавление задачи в tasks
		const teamDoc = await Team.findById(team);
		if (!teamDoc) {
			return res.status(404).json({ error: 'Команда не найдена' });
		}
		teamDoc.tasks.push(savedTask._id as unknown as ObjectId); // Добавление ID задачи в массив tasks
		const result = await teamDoc.save(); // Сохранение обновлённой команды

		res.status(201).json(result);
	} catch (err) {
		console.error('Ошибка создания задачи:', err);
		res.status(500).json({ error: 'Ошибка сервера' });
	}
};

export const taskStatusChange = async (req, res) => {
	try {
		const { _id, status } = req.body; // Правильная деструктуризация

		// Проверяем, что id и status переданы
		if (!_id || !status) {
			return res.status(400).json({ error: 'Необходимо передать id и статус' });
		}

		// Поиск и обновление задачи
		const task = await Task.findByIdAndUpdate(_id, { status }, { new: true, runValidators: true });

		if (!task) {
			return res.status(404).json({ error: 'Задача не найдена' });
		}

		res.json(task);
	} catch (err) {
		console.error('Ошибка обновления задачи:', err);
		res.status(500).json({ error: 'Ошибка сервера' });
	}
};

export const changeTask = async (req, res) => {
	try {
		const { _id, title, status, description, performer, deadline } = req.body;

		// Проверяем, что id передано
		if (!_id) {
			return res.status(400).json({ error: 'Необходимо передать _id задачи' });
		}

		// Поиск задачи по _id
		const task = await Task.findById(_id);
		if (!task) {
			return res.status(404).json({ error: 'Задача не найдена' });
		}

		// Обновление полей задачи
		task.title = title || task.title;
		task.status = status || task.status;
		task.description = description || task.description;
		task.performer = performer || task.performer;
		task.deadline = deadline ? new Date(deadline) : task.deadline;

		// Сохранение обновленной задачи
		const updatedTask = await task.save();

		res.json(updatedTask);
	} catch (err) {
		console.error('Ошибка обновления задачи:', err);
		res.status(500).json({ error: 'Ошибка сервера' });
	}
};

export const deleteTask = async (req, res) => {
	try {
		const { taskId } = req.body;

		// Проверка наличия id
		if (!taskId) {
			return res.status(400).json({ error: 'Необходимо передать id задачи' });
		}

		// Поиск и удаление задачи
		const deletedTask = await Task.findByIdAndDelete(taskId);

		if (!deletedTask) {
			return res.status(404).json({ error: 'Задача не найдена' });
		}

		// Удаляем задачу из массива tasks в команде
		await Team.updateOne({ tasks: taskId }, { $pull: { tasks: taskId } });

		res.json({ message: 'Задача успешно удалена', deletedTask });
	} catch (err) {
		console.error('Ошибка удаления задачи:', err);
		res.status(500).json({ error: 'Ошибка сервера' });
	}
};
