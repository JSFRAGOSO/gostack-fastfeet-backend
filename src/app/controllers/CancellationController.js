import Order from '../models/Order';
import DeliveryProblem from '../models/DeliveryProblem';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class CancelattionController {
    async delete(req, res) {
        const { id } = req.params;

        const deliveryProblem = await DeliveryProblem.findByPk(id, {
            include: [
                {
                    model: Order,
                    as: 'order',
                    attributes: ['id', 'recipient_id'],
                },
            ],
        });

        if (!deliveryProblem)
            return res.status(400).json({ error: 'Problem does not exist' });

        const order = await Order.findByPk(deliveryProblem.order_id, {
            include: [
                {
                    model: Deliveryman,
                    as: 'deliveryman',
                    attributes: ['id', 'name', 'email'],
                },
                {
                    model: Recipient,
                    as: 'recipient',
                    attributes: ['name', 'street', 'number', 'city', 'state'],
                },
            ],
        });

        if (order.end_date)
            return res
                .status(401)
                .json({ error: 'This order has already been delivered' });

        if (!order.canceled_at)
            return res
                .status(401)
                .json({ error: 'This order has already been canceled' });

        order.canceled_at = new Date();
        await order.save();

        Queue.add(CancellationMail.key, {
            deliveryman: order.deliveryman,
            order,
            recipient: order.recipient,
            deliveryProblem,
        });

        return res.json(order);
    }
}

export default new CancelattionController();
