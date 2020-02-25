import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
    async index(req, res) {
        const deliverymen = await Deliveryman.findAll();
        return res.json(deliverymen);
    }

    async create(req, res) {
        const { email } = req.body;

        const deliverymanExists = await Deliveryman.findOne({
            where: {
                email,
            },
        });

        if (deliverymanExists)
            return res
                .status(400)
                .json({ error: 'Delivery man already exists' });

        const deliveryman = await Deliveryman.create(req.body);

        return res.status(201).json(deliveryman);
    }

    async update(req, res) {
        const { email } = req.body;
        const { id } = req.params;

        const deliveryman = await Deliveryman.findByPk(id);

        if (!deliveryman)
            return res.status(400).json({ error: 'Deliverman does not exist' });

        if (email && email !== deliveryman.email) {
            const deliverymanExists = await Deliveryman.findOne({
                where: {
                    email,
                },
            });

            if (deliverymanExists)
                return res.status(400).json({ error: 'E-mail already exists' });
        }

        const { name, avatar_id } = await deliveryman.update(req.body);

        return res.json({ id, name, email, avatar_id });
    }

    async delete(req, res) {
        const { id } = req.params;

        const deliveryman = await Deliveryman.findByPk(id);

        if (!deliveryman)
            return res.status(400).json({ error: 'Deliverman does not exist' });

        await deliveryman.destroy();
        return res.status(204).json();
    }
}

export default new DeliverymanController();
