function withAssociations(sequelize) {
    const {Cuisines, Images} = sequelize.models;

    Cuisines.hasOne(Images, {
        foreignKey: 'id' ,
        as: 'image'
    });
    Images.belongsTo(Cuisines, {
        foreignKey: 'id'
    });
}

module.exports = {withAssociations};