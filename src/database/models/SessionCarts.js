/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class SessionCarts extends Model {
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
		cartId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: {
					tableName: 'orders',
					schema: 'public'
				},
				key: 'id'
			},
			field: 'cart_id'
		}
	}, {
		sequelize,
		tableName: 'session_carts',
		schema: 'public'
	});
	return SessionCarts;
	}
}
