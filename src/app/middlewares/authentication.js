import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/authConfig';

export default async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        res.status(401).json({ error: 'User is not authenticated' });
    }
    const [, token] = authorization.split(' ');

    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);

        req.tokenId = decoded.id;

        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid Token' });
    }
};
