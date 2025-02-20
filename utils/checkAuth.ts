import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export default (req, res, next) => {
	const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

	if (!token) {
		return res.status(403).json({ message: 'Нет доступа' });
	}
	try {
		const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayload & { _id: string };
		req.body.userId = decoded._id;
		next();
	} catch (err) {
		return res.status(403).json({ message: 'Нет доступа' });
	}
};
