import Sequelize, { Model } from 'sequelize';

class DeliveryProblem extends Model {
    static init(sequelize) {
        super.init(
            {
                description: Sequelize.STRING,
            },
            {
                sequelize,
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.Order, {
            foreignKey: 'order_id',
            as: 'order',
        });
    }
}

export default DeliveryProblem;
