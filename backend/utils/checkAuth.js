import jwt from 'jsonwebtoken';
import {key} from "../key/key.js";

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            const decode = jwt.verify(token, key);

            req.userId = decode._id;
            next();
        } catch (err) {
            return res.status(403).json({
                message: 'Нет доступа',
            });
        }
    } else {
        return res.status(403).json({
            message: "Нет доступа",
        })
    }

}