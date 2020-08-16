function withAssociations(sequelize) {
    const {Cuisines, Images, Outlets, Locations, OutletImages} = sequelize.models;

    // Cuisine relationship
    Cuisines.hasOne(Images, {
        foreignKey: 'id',
        as: 'image'
    });
    Images.belongsTo(Cuisines, {
        foreignKey: 'id'
    });

    // Outlet relationship
    Outlets.hasOne(Cuisines, {
        foreignKey: 'id',
        as: 'cuisine'
    });
    Cuisines.belongsTo(Outlets, {
        foreignKey: 'id'
    });
    Outlets.hasOne(Locations, {
        foreignKey: 'id',
        as: 'location'
    });
    Locations.belongsTo(Outlets, {
        foreignKey: 'id'
    });

    // Outlet-image relationship
    OutletImages.hasOne(Outlets, {
        foreignKey: 'id',
        as: 'outlet'
    });
    OutletImages.hasOne(Images, {
        foreignKey: 'id',
        as: 'image'
    });
    Outlets.belongsTo(OutletImages, {
        foreignKey: 'id',
    });
    Images.belongsTo(OutletImages, {
        foreignKey: 'id',
    });

}

module.exports = {withAssociations};