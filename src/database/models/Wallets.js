/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class Wallets extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
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
		mainPaymentMethodId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: {
					tableName: 'payment_methods',
					schema: 'public'
				},
				key: 'id'
			},
			field: 'main_payment_method_id'
		}
	}, {
		sequelize,
		tableName: 'wallets',
		schema: 'public'
	});
	return Wallets;
	}
}
