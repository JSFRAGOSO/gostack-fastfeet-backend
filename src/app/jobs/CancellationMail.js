import Mail from '../../lib/Mail';

class CancellationMail {
    get key() {
        return 'CancellationMail';
    }

    async handle({ data }) {
        const { deliveryman, order, recipient, deliveryProblem } = data;
        await Mail.sendMail({
            to: `${deliveryman.name} <${deliveryman.email}>`,
            subject: `Cancelamento na entrega de ${recipient.name}`,
            template: 'cancellation',
            context: {
                deliverman: deliveryman.name,
                recipient: recipient.name,
                street: recipient.street,
                number: recipient.number,
                city: recipient.city,
                state: recipient.state,
                product: order.product,
                problem: deliveryProblem.description,
            },
        });
    }
}
export default new CancellationMail();
