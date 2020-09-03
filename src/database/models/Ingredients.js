/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class Ingredients extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		title: {
			type: DataTypes.CITEXT,
			allowNull: false
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
		tableName: 'ingredients',
		schema: 'public'
	});
	return Ingredients;
	}
}
