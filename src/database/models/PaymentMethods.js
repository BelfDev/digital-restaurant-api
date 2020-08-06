/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class PaymentMethods extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		type: {
			type: DataTypes.ENUM("CREDIT_CARD","CASH","APPLE_PAY","GOOGLE_PAY"),
			allowNull: false
		},
		creditCardId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: {
					tableName: 'credit_cards',
					schema: 'public'
				},
				key: 'id'
			},
			field: 'credit_card_id'
		}
	}, {
		sequelize,
		tableName: 'payment_methods',
		schema: 'public'
	});
	return PaymentMethods;
	}
}
