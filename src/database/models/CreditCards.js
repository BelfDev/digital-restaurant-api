/* jshint indent: 1 */

import { Model } from 'sequelize';

export default class CreditCards extends Model {
	static init(sequelize, DataTypes) {
	super.init({
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		number: {
			type: DataTypes.DOUBLE,
			allowNull: false
		},
		expiry: {
			type: DataTypes.DATE,
			allowNull: false
		},
		cvv: {
			type: DataTypes.DOUBLE,
			allowNull: false
		},
		countryCode: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'country_code'
		},
		cardholder: {
			type: DataTypes.TEXT,
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
		tableName: 'credit_cards',
		schema: 'public'
	});
	return CreditCards;
	}
}
