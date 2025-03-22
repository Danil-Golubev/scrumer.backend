import { validationResult } from 'express-validator';
import { Team, User } from '../models/Models';
import { Schema } from 'mongoose';
export const createTeam = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}
		const user = await User.findById(req.body.userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		const employee = {
			user: req.body.userId,
			position: 'admin',
		};
		const doc = new Team({
			title: req.body.title,
			description: req.body.description,
			deadline: req.body.deadline,
			sprintDuration: req.body.sprintDuration,
			members: [employee],
			tasks: [],
		});
		const team = await doc.save();
		user.team = team._id as Schema.Types.ObjectId;
		await user.save();
		res.json(team);
	} catch (err) {
		res.status(500).json({ err });
	}
};

export const joinTeam = async (req, res) => {
	try {
		const teamId = req.params.id;
		const user = await User.findById(req.body.userId);
		const team = await Team.findById(teamId);
		if (!user) {
			return res.status(404).json({ message: 'Пользователь не найден' });
		}
		if (!team) {
			return res.status(404).json({ message: 'Команда не найдена' });
		}
		user.team = teamId as Schema.Types.ObjectId;
		await user.save();
		team.members.push({ user: req.body.userId, position: 'none' });
		await team.save();
		res.json({ message: 'Присоединение успешно' });
	} catch (err) {
		res.status(500).json({ err });
	}
};

export const getMyTeam = async (req, res) => {
	try {
		const user = await User.findById(req.body.userId).populate('team');
		if (!user) {
			return res.status(404).json({ message: 'Пользователь не найден' });
		}

		if (!user.team) {
			return res.status(404).json({ message: 'Команды не найдены' });
		}

		res.json(user.team);
	} catch (err) {
		res.status(500).json({ err });
	}
};
