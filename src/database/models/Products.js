/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class Products extends Model {
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
		unitPrice: {
			type: DataTypes.DOUBLE,
			allowNull: false,
			field: 'unit_price'
		},
		description: {
			type: DataTypes.CITEXT,
			allowNull: true
		},
		preparationTime: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: 'preparation_time'
		}
	}, {
		sequelize,
		tableName: 'products',
		schema: 'public'
	});
	return Products;
	}
}
