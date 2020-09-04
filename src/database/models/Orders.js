/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class Orders extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
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
		},
		userId: {
			type: DataTypes.UUIDV4,
			allowNull: false,
			references: {
				model: {
					tableName: 'accounts',
					schema: 'public'
				},
				key: 'user_id'
			},
			field: 'user_id'
		},
		subtotal: {
			type: DataTypes.DOUBLE,
			allowNull: false
		},
		status: {
			type: DataTypes.ENUM("OPEN","PAID"),
			allowNull: false,
			defaultValue: "OPEN"
		},
		createdOn: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'created_on'
		},
		updatedOn: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'updated_on'
		}
	}, {
		sequelize,
		tableName: 'orders',
		schema: 'public'
	});
	return Orders;
	}
}
