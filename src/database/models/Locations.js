/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class Locations extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		city: {
			type: DataTypes.CITEXT,
			allowNull: false
		}
	}, {
		sequelize,
		tableName: 'locations',
		schema: 'public'
	});
	return Locations;
	}
}
