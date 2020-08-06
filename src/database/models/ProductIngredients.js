/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class ProductIngredients extends Model {
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
		ingredientId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: {
					tableName: 'ingredients',
					schema: 'public'
				},
				key: 'id'
			},
			field: 'ingredient_id'
		}
	}, {
		sequelize,
		tableName: 'product_ingredients',
		schema: 'public'
	});
	return ProductIngredients;
	}
}
