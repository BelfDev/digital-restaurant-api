/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class Accounts extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		userId: {
			type: DataTypes.UUIDV4,
			allowNull: false,
			defaultValue: sequelize.fn('uuid_generate_v4'),
			primaryKey: true,
			field: 'user_id'
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		password: {
			type: DataTypes.CITEXT,
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
		},
		lastLogin: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'last_login'
		}
	}, {
		sequelize,
		tableName: 'accounts',
		schema: 'public'
	});
	return Accounts;
	}
}
