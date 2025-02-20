import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/Models';
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}
		const password = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(password, salt);
		const doc = new User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			passwordHash,
			tgId: null,
		});
		const user = await doc.save();
		const token = jwt.sign(
			{
				_id: user._id,
			},
			process.env.SECRET_KEY as string,
			{ expiresIn: '30d' },
		);
		res.json({ ...user.toObject(), token });
	} catch (err) {
		res.status(500).json({ message: 'Не удалось зарегестрироваться' });
	}
};

export const login = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res.status(404).json({
				message: 'Пользователя нет',
			});
		}
		const isValidPass = await bcrypt.compare(req.body.password, user.toObject().passwordHash);

		if (!isValidPass) {
			return res.status(404).json({
				message: 'Неверный логин или пароль',
			});
		}
		const token = jwt.sign(
			{
				_id: user._id,
			},
			process.env.SECRET_KEY as string,
			{ expiresIn: '30d' },
		);

		res.json({ ...user.toObject(), token });
	} catch (err) {
		res.status(500).json({ message: 'Не удалось авторизоваться' });
	}
};

export const authMe = async (req, res) => {
	try {
		const user = await User.findById(req.body.userId);
		if (!user) {
			return res.status(404).json({ message: 'Пользователь не найден' });
		}
		res.json(user.toObject());
	} catch (err) {
		res.status(500).json({ message: 'Нет доступа' });
	}
};
