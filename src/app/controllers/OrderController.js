import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';
import File from '../models/File';
import Queue from '../../lib/Queue';
import NewOrderMail from '../jobs/NewOrderMail';

class OrderController {
    async index(req, res) {
        const order = await Order.findAll({
            include: [
                {
                    model: Deliveryman,
                    as: 'deliveryman',
                    attributes: ['name', 'id'],
                },
                {
                    model: Recipient,
                    as: 'recipient',
                    attributes: ['name', 'id'],
                },
                {
                    model: File,
                    as: 'signature',
                    attributes: ['url', 'path'],
                },
            ],
        });

        return res.json(order);
    }

    async store(req, res) {
        const { product, recipient_id, deliveryman_id } = req.body;

        if (!(product && recipient_id && deliveryman_id))
            return res.status(401).json({
                error:
                    'To create an Order you must provide Product, Deliveryman and Recipient',
            });

        const recipient = await Recipient.findByPk(recipient_id);
        if (!recipient)
            return res.status(401).json({
                error: 'Recipient does not exist',
            });

        const deliveryman = await Deliveryman.findByPk(deliveryman_id);
        if (!deliveryman)
            return res.status(401).json({
                error: 'Deliveryman does not exist',
            });

        const order = await Order.create(req.body);

        Queue.add(NewOrderMail.key, { deliveryman, order, recipient });

        return res.json(order);
    }

    async update(req, res) {
        const { id } = req.params;
        const { recipient_id, deliveryman_id } = req.body;

        const order = await Order.findByPk(id);
        if (!order)
            return res.status(400).json({ error: 'Order does not exist' });

        /*
         * Validar a existência do destinatário somente se foi
         * informado algum destinatário e o mesmo é diferente do atual na order
         */
        if (recipient_id && order.recipient_id !== recipient_id) {
            const recipient = await Recipient.findByPk(recipient_id);
            if (!recipient)
                return res.status(401).json({
                    error: 'Recipient does not exist',
                });
        }
        /*
         * Validar a existência do entregador somente se foi
         * informado algum entregador e o mesmo é diferente do atual na order
         */
        if (deliveryman_id && order.deliveryman_id !== deliveryman_id) {
            const deliveryman = await Deliveryman.findByPk(deliveryman_id);
            if (!deliveryman)
                return res.status(401).json({
                    error: 'Deliveryman does not exist',
                });
        }

        const { product } = await order.update(req.body);

        return res.json({ id, product, recipient_id, deliveryman_id });
    }

    async delete(req, res) {
        const { id } = req.params;

        const order = await Order.findByPk(id);

        if (!order)
            return res.status(400).json({ error: 'Order does not exist' });

        await order.destroy();

        return res.json();
    }
}

export default new OrderController();
