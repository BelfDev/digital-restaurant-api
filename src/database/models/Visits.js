/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class Visits extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		profileId: {
			type: DataTypes.INTEGER,
			allowNull: false,
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
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		}
	}, {
		sequelize,
		tableName: 'visits',
		schema: 'public'
	});
	return Visits;
	}
}
