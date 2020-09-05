
function withAssociations(sequelize) {
    const {Cuisines, Images, Outlets, Locations, Products, Categories, Ingredients, FeaturedOutlets, Carts, Sessions, CartItems} = sequelize.models;

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
    Outlets.belongsToMany(Images, {through: 'OutletImages', foreignKey: 'outletId', as: 'images'})
    Images.belongsToMany(Outlets, {through: 'OutletImages', foreignKey: 'imageId'})

    Outlets.belongsToMany(Products, {through: 'OutletProducts', foreignKey: 'outletId', as: 'products'})
    Products.belongsToMany(Outlets, {through: 'OutletProducts', foreignKey: 'productId'})

    // Featured outlets relationship
    Outlets.hasMany(FeaturedOutlets, {
        foreignKey: 'outletId'
    });
    FeaturedOutlets.belongsTo(Outlets, {
        foreignKey: 'outletId',
        as: 'outlet'
    })

    // Product relationship
    Products.belongsToMany(Images, {through: 'ProductImages', foreignKey: 'productId', as: 'images'})
    Images.belongsToMany(Products, {through: 'ProductImages', foreignKey: 'imageId'})

    Products.belongsToMany(Categories, {through: 'ProductCategories', foreignKey: 'productId', as: 'categories'})
    Categories.belongsToMany(Products, {through: 'ProductCategories', foreignKey: 'categoryId'})

    Products.belongsToMany(Ingredients, {through: 'ProductIngredients', foreignKey: 'productId', as: 'ingredients'})
    Ingredients.belongsToMany(Products, {through: 'ProductIngredients', foreignKey: 'ingredientId'})

    Outlets.belongsToMany(Products, {through: 'FeaturedOutletProducts', foreignKey: 'outletId', as: 'featuredProducts'})
    Products.belongsToMany(Outlets, {through: 'FeaturedOutletProducts', foreignKey: 'productId'})


    // Category relationship
    Images.hasMany(Categories, {
        foreignKey: 'imageId',
    });
    Categories.belongsTo(Images, {
        foreignKey: 'imageId',
        as: 'image'
    });


    // Ingredient relationship
    Images.hasMany(Ingredients, {
        foreignKey: 'imageId',
    });
    Ingredients.belongsTo(Images, {
        foreignKey: 'imageId',
        as: 'image'
    });

    // Cart relationship
    Sessions.belongsToMany(Images, {through: 'SessionCarts', foreignKey: 'sessionId', as: 'carts'})
    Carts.belongsToMany(Products, {through: 'SessionCarts', foreignKey: 'cartId'})

    Carts.belongsToMany(Products, {through: 'CartItems', foreignKey: 'cartId', as: 'items'})
    Products.belongsToMany(Carts, {through: 'CartItems', foreignKey: 'productId'})

}

module.exports = {withAssociations};