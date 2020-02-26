import { Op } from 'sequelize';
import Order from '../models/Order';

class DeliveredOrderController {
    async index(req, res) {
        const { id: deliveryman_id } = req.params;

        const orders = await Order.findAll({
            where: {
                deliveryman_id,
                end_date: {
                    [Op.not]: null,
                },
            },
        });

        return res.json(orders);
    }
}

export default new DeliveredOrderController();
