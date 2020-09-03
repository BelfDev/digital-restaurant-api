/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class OutletTable extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		number: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		outletId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: {
					tableName: 'outlets',
					schema: 'public'
				},
				key: 'id'
			},
			field: 'outlet_id'
		},
		occupied: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	}, {
		sequelize,
		tableName: 'outlet_table',
		schema: 'public'
	});
	return OutletTable;
	}
}
