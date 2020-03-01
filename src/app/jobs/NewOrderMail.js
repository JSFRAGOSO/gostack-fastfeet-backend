import Mail from '../../lib/Mail';

class NewOrderMail {
    get key() {
        return 'NewOrderMail';
    }

    async handle({ data }) {
        const { deliveryman, order, recipient } = data;
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
    }
}
export default new NewOrderMail();
