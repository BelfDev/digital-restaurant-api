/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class WalletPaymentMethods extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		walletId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			references: {
				model: {
					tableName: 'wallets',
					schema: 'public'
				},
				key: 'id'
			},
			field: 'wallet_id'
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
		}
	}, {
		sequelize,
		tableName: 'wallet_payment_methods',
		schema: 'public'
	});
	return WalletPaymentMethods;
	}
}
