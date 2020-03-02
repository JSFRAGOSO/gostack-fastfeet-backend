class DeliveryController {
    async store(req, res) {
        return res.json({ delivery: true });
    }
}

export default new DeliveryController();
