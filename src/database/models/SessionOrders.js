/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class SessionOrders extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		sessionId: {
			type: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true,
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
		}
	}, {
		sequelize,
		tableName: 'session_orders',
		schema: 'public'
	});
	return SessionOrders;
	}
}
