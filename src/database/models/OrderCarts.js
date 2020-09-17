/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class OrderCarts extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		orderId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			references: {
				model: {
					tableName: 'orders',
					schema: 'public'
				},
				key: 'id'
			},
			field: 'order_id'
		},
		cartId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: {
					tableName: 'carts',
					schema: 'public'
				},
				key: 'id'
			},
			field: 'cart_id'
		}
	}, {
		sequelize,
		tableName: 'order_carts',
		schema: 'public'
	});
	return OrderCarts;
	}
}
