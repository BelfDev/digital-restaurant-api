/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class Payments extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		paymentMethodId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: {
					tableName: 'payment_methods',
					schema: 'public'
				},
				key: 'id'
			},
			field: 'payment_method_id'
		},
		sessionId: {
			type: DataTypes.UUIDV4,
			allowNull: false,
			references: {
				model: {
					tableName: 'sessions',
					schema: 'public'
				},
				key: 'id'
			},
			field: 'session_id'
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
		},
		total: {
			type: DataTypes.DOUBLE,
			allowNull: false
		},
		createdOn: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'created_on'
		}
	}, {
		sequelize,
		tableName: 'payments',
		schema: 'public'
	});
	return Payments;
	}
}
