import Order from '../models/Order';

class UndeliveredOrderController {
    async index(req, res) {
        const { id: deliveryman_id } = req.params;

        const orders = await Order.findAll({
            where: {
                deliveryman_id,
                end_date: null,
                canceled_at: null,
            },
        });

        return res.json(orders);
    }
}

export default new UndeliveredOrderController();
