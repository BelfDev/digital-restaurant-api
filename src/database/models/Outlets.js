/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class Outlets extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		cuisineId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: {
					tableName: 'cuisines',
					schema: 'public'
				},
				key: 'id'
			},
			field: 'cuisine_id'
		},
		title: {
			type: DataTypes.CITEXT,
			allowNull: false
		},
		rating: {
			type: DataTypes.DOUBLE,
			allowNull: true,
			defaultValue: "0.0"
		},
		priceLevel: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: 'price_level'
		},
		locationId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: {
					tableName: 'locations',
					schema: 'public'
				},
				key: 'id'
			},
			field: 'location_id'
		}
	}, {
		sequelize,
		tableName: 'outlets',
		schema: 'public'
	});
	return Outlets;
	}
}
