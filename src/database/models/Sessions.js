/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class Sessions extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		id: {
			type: DataTypes.UUIDV4,
			allowNull: false,
			defaultValue: sequelize.fn('uuid_generate_v4'),
			primaryKey: true
		},
		userId: {
			type: DataTypes.UUIDV4,
			allowNull: true,
			references: {
				model: {
					tableName: 'accounts',
					schema: 'public'
				},
				key: 'user_id'
			},
			field: 'user_id'
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
		tableName: 'sessions',
		schema: 'public'
	});
	return Sessions;
	}
}
