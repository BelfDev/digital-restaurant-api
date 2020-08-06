/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class PaymentOrders extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		paymentId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			references: {
				model: {
					tableName: 'payments',
					schema: 'public'
				},
				key: 'payment_id'
			},
			field: 'payment_id'
		},
		orderId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: {
					tableName: 'orders',
					schema: 'public'
				},
				key: 'id'
			},
			field: 'order_id'
		}
	}, {
		sequelize,
		tableName: 'payment_orders',
		schema: 'public'
	});
	return PaymentOrders;
	}
}
