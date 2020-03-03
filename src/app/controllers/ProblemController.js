import Order from '../models/Order';
import DeliveryProblem from '../models/DeliveryProblem';

class ProblemController {
    async index(req, res) {
        const { id } = req.params;

        const order = await Order.findByPk(id);

        if (!order)
            return res.status(401).json({ error: 'Order does not exists' });

        const deliveryProblems = await DeliveryProblem.findAll({
            where: {
                order_id: order.id,
            },
        });

        return res.json(deliveryProblems);
    }

    async store(req, res) {
        const { id } = req.params;
        const { description } = req.body;

        const order = await Order.findByPk(id);

        if (!order)
            return res.status(401).json({ error: 'Order does not exists' });

        const deliveryProblem = await DeliveryProblem.create({
            description,
            order_id: order.id,
        });

        return res.json(deliveryProblem);
    }
}

export default new ProblemController();
