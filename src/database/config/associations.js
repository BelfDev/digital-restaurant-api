function withAssociations(sequelize) {
    const {Cuisines, Images, Outlets, Locations, OutletImages} = sequelize.models;

    // Cuisine relationship
    Images.hasMany(Cuisines, {
        foreignKey: 'imageId',
    });
    Cuisines.belongsTo(Images, {
        foreignKey: 'imageId',
        as: 'image'
    });

    // Outlet relationship
    Cuisines.hasMany(Outlets, {
        foreignKey: 'cuisineId',
    });
    Outlets.belongsTo(Cuisines, {
        foreignKey: 'cuisineId',
        as: 'cuisine'
    });
    Locations.hasMany(Outlets, {
        foreignKey: 'locationId',
    });
    Outlets.belongsTo(Locations, {
        foreignKey: 'locationId',
        as: 'location'
    });

}

module.exports = {withAssociations};