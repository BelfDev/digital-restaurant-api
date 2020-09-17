/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class Orders extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		subtotal: {
			type: DataTypes.DOUBLE,
			allowNull: false,
			defaultValue: "0.0"
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
