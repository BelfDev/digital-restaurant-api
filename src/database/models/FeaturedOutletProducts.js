/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class FeaturedOutletProducts extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		outletId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			references: {
				model: {
					tableName: 'outlets',
					schema: 'public'
				},
				key: 'id'
			},
			field: 'outlet_id'
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
		}
	}, {
		sequelize,
		tableName: 'featured_outlet_products',
		schema: 'public'
	});
	return FeaturedOutletProducts;
	}
}
