/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class ProductCategories extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		productId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			references: {
				model: {
					tableName: 'products',
					schema: 'public'
				},
				key: 'id'
			},
			field: 'product_id'
		},
		categoryId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: {
					tableName: 'categories',
					schema: 'public'
				},
				key: 'id'
			},
			field: 'category_id'
		}
	}, {
		sequelize,
		tableName: 'product_categories',
		schema: 'public'
	});
	return ProductCategories;
	}
}
