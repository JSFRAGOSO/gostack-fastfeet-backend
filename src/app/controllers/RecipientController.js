import Recipient from '../models/Recipient';

class RecipientController {
    async store(req, res) {
        const { name } = req.body;

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
        const { id } = req.params;

        const recipient = Recipient.findByPk(id);

        const {
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
