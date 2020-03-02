import { Op } from 'sequelize';
import {
    isAfter,
    isBefore,
    startOfDay,
    endOfDay,
    format,
    setHours,
    parseISO,
} from 'date-fns';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';

class PickupController {
    async store(req, res) {
        const { delivermanId, orderId } = req.params;
        const { date } = req.body;
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

        const pickupTime = parseISO(date);

        /*
         * Check for past dates
         */

        if (isBefore(pickupTime, new Date()))
            return res.status(401).json({
                error: 'Past dates are no allowed',
            });

        /*
         * Check if the pickup is in the allowed time slot
         */

        const availableStartTime = setHours(startOfDay(pickupTime), 8);

        const availableEndTime = setHours(startOfDay(pickupTime), 18);

        if (
            isBefore(pickupTime, availableStartTime) ||
            isAfter(pickupTime, availableEndTime)
        ) {
            const formattedStartTime = format(availableStartTime, 'HH:mm');
            const formattedEndTime = format(availableEndTime, 'HH:mm');

            return res.status(401).json({
                error: `You can only pickup an order betwheen ${formattedStartTime}h and ${formattedEndTime}h`,
            });
        }

        /*
         * Check if the deliverman already reached 5 pickups today
         */

        const { count: todayPickups } = await Order.findAndCountAll({
            where: {
                deliveryman_id: deliveryman.id,
                start_date: {
                    [Op.between]: [
                        startOfDay(pickupTime),
                        endOfDay(pickupTime),
                    ],
                },
            },
        });

        if (todayPickups >= 5)
            return res.status(401).json({
                error:
                    'You can only pickup 5 orders in a day, please try again tomorrow',
            });

        order.start_date = pickupTime;
        await order.save();

        return res.json(order);
    }
}

export default new PickupController();
