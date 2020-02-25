import User from '../models/User';

export default async (req, res, next) => {
    const { tokenId } = req;

    const user = await User.findByPk(tokenId);

    if (!user.is_admin)
        return res.status(401).json({
            error:
                'This functionality is for administrators authenticated in the application.',
        });

    return next();
};
