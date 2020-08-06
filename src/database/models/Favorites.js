/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class Favorites extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		profileId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			references: {
				model: {
					tableName: 'profiles',
					schema: 'public'
				},
				key: 'id'
			},
			field: 'profile_id'
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
		}
	}, {
		sequelize,
		tableName: 'favorites',
		schema: 'public'
	});
	return Favorites;
	}
}
