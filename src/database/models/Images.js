/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class Images extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		source: {
			type: DataTypes.TEXT,
			allowNull: false
		}
	}, {
		sequelize,
		tableName: 'images',
		schema: 'public'
	});
	return Images;
	}
}
