/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class Carts extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		sessionId: {
			type: DataTypes.UUIDV4,
			allowNull: false,
			references: {
				model: {
					tableName: 'sessions',
					schema: 'public'
				},
				key: 'id'
			},
			field: 'session_id'
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
		subtotal: {
			type: DataTypes.DOUBLE,
			allowNull: false
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
		tableName: 'carts',
		schema: 'public'
	});
	return Carts;
	}
}
