function withAssociations(sequelize) {
    const {Cuisines, Images} = sequelize.models;

    Cuisines.hasOne(Images, {
        foreignKey: 'id'
    });
    Images.belongsTo(Cuisines, {
        foreignKey: 'id'
    });
}

module.exports = {withAssociations};