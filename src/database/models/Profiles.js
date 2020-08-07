/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class Profiles extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: {
					tableName: 'accounts',
					schema: 'public'
				},
				key: 'user_id'
			},
			field: 'user_id'
		},
		imageId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: {
					tableName: 'images',
					schema: 'public'
				},
				key: 'id'
			},
			field: 'image_id'
		},
		updatedOn: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'updated_on'
		}
	}, {
		sequelize,
		tableName: 'profiles',
		schema: 'public'
	});
	return Profiles;
	}
}
