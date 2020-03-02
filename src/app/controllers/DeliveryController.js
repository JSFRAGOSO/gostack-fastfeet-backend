import { isBefore, parseISO } from 'date-fns';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';

class DeliveryController {
    async store(req, res) {
        const { delivermanId, orderId } = req.params;
        const { date, signature_id } = req.body;
        /*
         * Check if deliverman exists
         */
        const deliveryman = await Deliveryman.findByPk(delivermanId);
        if (!deliveryman)
            return res.status(400).json({
                error: 'Deliveryman does not exist',
            });

        /*
         * Check if order exists
         */

        const order = await Order.findByPk(orderId);
        if (!order)
            return res.status(400).json({
                error: 'Order does not exist',
            });

        /*
         * Check if this order is assigned to this deliverman
         */

        if (order.deliveryman_id !== deliveryman.id)
            return res.status(401).json({
                error: 'This order do not belongs to this deliveryman',
            });

        /*
         * Check if this order has already been picked up
         */

        if (!order.start_date)
            return res.status(401).json({
                error: 'This order has not been picked up yet',
            });
        /*
         * Check if this order has already been delivered
         */

        if (order.end_date)
            return res.status(401).json({
                error: 'This order has already been delivered',
            });

        const deliveryTime = parseISO(date);

        /*
         * Check for past dates
         */

        if (
            isBefore(deliveryTime, new Date()) ||
            isBefore(deliveryTime, order.start_date)
        )
            return res.status(401).json({
                error: 'Past dates are no allowed',
            });

        /*
         * Check if the delivery date is before the pickup
         */

        if (isBefore(deliveryTime, order.start_date))
            return res.status(401).json({
                error:
                    'Invalid delivery date, it can not be before the pickup date',
            });

        order.signature_id = signature_id;
        order.end_date = deliveryTime;

        await order.save();

        return res.json(order);
    }
}

export default new DeliveryController();
