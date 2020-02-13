import Recipient from '../models/Recipient';
import User from '../models/User';

class RecipientController {
    async store(req, res) {
        const { tokenId } = req;
        const { name } = req.body;

        const user = await User.findByPk(tokenId);

        if (!user.is_admin)
            return res.status(401).json({
                error: 'Only Admin can create Recipients',
            });

        const recipientExists = await Recipient.findOne({ where: { name } });

        if (recipientExists)
            return res.status(400).json({ error: 'Recipient already exists' });

        const {
            id,
            street,
            number,
            state,
            city,
            complement,
            zip_code,
        } = await Recipient.create(req.body);

        return res.status(201).json({
            id,
            name,
            street,
            number,
            state,
            city,
            complement,
            zip_code,
        });
    }

    async update(req, res) {
        const { tokenId } = req;
        const { recipientId } = req.params;

        const user = await User.findByPk(tokenId);

        if (!user.is_admin)
            return res.status(401).json({
                error: 'Only Admin can update Recipients',
            });

        const recipient = Recipient.findByPk(recipientId);

        const {
            id,
            name,
            street,
            number,
            state,
            city,
            complement,
            zip_code,
        } = await (await recipient).update(req.body);

        return res.status(200).json({
            id,
            name,
            street,
            number,
            state,
            city,
            complement,
            zip_code,
        });
    }
}

export default new RecipientController();
