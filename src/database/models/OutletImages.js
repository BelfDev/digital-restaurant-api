/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class OutletImages extends Model {
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
		tableName: 'outlet_images',
		schema: 'public'
	});
	return OutletImages;
	}
}
