class OrderController {
    async store(req, res) {
        const { product, recipient_id, deliveryman_id } = req.body;
        if (!(product && recipient_id && deliveryman_id))
            return res.status(400).json({
                error:
                    'To create an Order you must provide Product, Deliveryman and Recipient',
            });
        return res.json({ ok: true });
    }
}

export default new OrderController();
