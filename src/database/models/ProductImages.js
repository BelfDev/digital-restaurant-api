/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class ProductImages extends Model {
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
		imageId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: {
					tableName: 'images',
					schema: 'public'
				},
				key: 'id'
			},
			field: 'image_id'
		}
	}, {
		sequelize,
		tableName: 'product_images',
		schema: 'public'
	});
	return ProductImages;
	}
}
