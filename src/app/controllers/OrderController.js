import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';
import Mail from '../../lib/Mail';

class OrderController {
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

        await Mail.sendMail({
            to: `${deliveryman.name} <${deliveryman.email}>`,
            subject: `Nova entrega para ${recipient.name}`,
            template: 'neworder',
            context: {
                deliverman: deliveryman.name,
                recipient: recipient.name,
                street: recipient.street,
                number: recipient.number,
                city: recipient.city,
                state: recipient.state,
                complement: recipient.complement,
                zipcode: recipient.zip_code,
                product: order.product,
            },
        });

        return res.json(order);
    }
}

export default new OrderController();
