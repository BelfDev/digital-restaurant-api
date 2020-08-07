/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class CartItems extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		cartId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			references: {
				model: {
					tableName: 'carts',
					schema: 'public'
				},
				key: 'id'
			},
			field: 'cart_id'
		},
		productId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: {
					tableName: 'products',
					schema: 'public'
				},
				key: 'id'
			},
			field: 'product_id'
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		total: {
			type: DataTypes.DOUBLE,
			allowNull: false
		},
		status: {
			type: DataTypes.ENUM("NOT_ORDERED","PREPARING","DELIVERED"),
			allowNull: false,
			defaultValue: "NOT_ORDERED"
		}
	}, {
		sequelize,
		tableName: 'cart_items',
		schema: 'public'
	});
	return CartItems;
	}
}
