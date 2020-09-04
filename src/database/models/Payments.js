/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class Payments extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		paymentId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			field: 'payment_id'
		},
		paymentMethodId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: {
					tableName: 'payment_methods',
					schema: 'public'
				},
				key: 'id'
			},
			field: 'payment_method_id'
		},
		userId: {
			type: DataTypes.UUIDV4,
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
		total: {
			type: DataTypes.DOUBLE,
			allowNull: false
		},
		createdOn: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			field: 'created_on'
		}
	}, {
		sequelize,
		tableName: 'payments',
		schema: 'public'
	});
	return Payments;
	}
}
