import { body } from 'express-validator';

export const registerValidation = [
	body('email').isEmail(),
	body('password').isLength({ min: 7 }),
	body('firstName').isLength({ min: 3 }),
	body('lastName').isLength({ min: 3 }),
];

export const createTeamValidation = [body('title').isLength({ min: 5 }), body('description').isLength({ min: 12 })];
