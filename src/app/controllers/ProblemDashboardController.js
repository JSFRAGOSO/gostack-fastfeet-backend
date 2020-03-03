import Order from '../models/Order';
import DeliveryProblem from '../models/DeliveryProblem';

class ProblemDashboardController {
    async index(req, res) {
        const deliveriesWithProblems = await Order.findAll({
            include: [
                {
                    model: DeliveryProblem,
                    as: 'problems',
                    attributes: ['id', 'description', 'created_at'],
                    required: true,
                },
            ],
        });

        return res.json(deliveriesWithProblems);
    }
}

export default new ProblemDashboardController();
