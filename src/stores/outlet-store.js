/**
 * Data access layer for the Outlet model.
 * Gets the logger and database injected.
 * Methods: FIND, GET
 */
const createOutletStore = (logger, db) => {
    const Outlet = db.Outlets;

    const buildLocationCondition = (city) => city ? {
        where: {
            city: city
        }
    } : {};

    const buildCuisineCondition = (cuisine) => cuisine ? {
        where: {
            title: cuisine
        }
    } : {};

    const getOutletOptions = (params) => {
        let locationCondition = {};
        let cuisineCondition = {};
        if (params) {
            if (params.city) {
                locationCondition = buildLocationCondition(params.city);
            }
            if (params.cuisine) {
                cuisineCondition = buildCuisineCondition(params.cuisine);
            }
        }

        return {
            include: [
                {
                    model: db.Cuisines,
                    as: 'cuisine',
                    attributes: {
                        exclude: ['id', 'imageId']
                    },
                    ...cuisineCondition,
                },
                {
                    model: db.Locations,
                    as: 'location',
                    attributes: {
                        exclude: ['id']
                    },
                    ...locationCondition
                },
                {
                    model: db.Images,
                    as: 'images',
                    attributes: {
                        exclude: ['id']
                    },
                    through: {attributes: []}
                }
            ],
            attributes: {
                exclude: [
                    'cuisineId',
                    'locationId',
                ]
            },
        }
    };

    const getProductOptions = (params) => {
        let associationIdentifier = 'products';
        if (params && params['isFeatured']) {
            associationIdentifier = 'featuredProducts'
        }
        return {
            include: [
                {
                    model: db.Products,
                    as: associationIdentifier,
                    include: [
                        {
                            model: db.Images,
                            as: 'images',
                            attributes: {
                                exclude: ['id']
                            },
                            through: {attributes: []}
                        },
                        {
                            model: db.Ingredients,
                            as: 'ingredients',
                            attributes: {
                                exclude: ['id', 'imageId']
                            },
                            include: [
                                {
                                    model: db.Images,
                                    as: 'image',
                                    attributes: {
                                        exclude: ['id']
                                    },
                                }
                            ],
                            through: {attributes: []}
                        },
                        {
                            model: db.Categories,
                            as: 'categories',
                            attributes: {
                                exclude: ['id', 'imageId']
                            },
                            include: [
                                {
                                    model: db.Images,
                                    as: 'image',
                                    attributes: {
                                        exclude: ['id']
                                    },
                                }
                            ],
                            through: {attributes: []}
                        }
                    ],
                    through: {attributes: []}
                },
            ],
        }
    }

    return {
        /**
         * Retrieves all outlet entities from the database.
         * @returns {Promise<Outlets[]>}
         */
        async find(params) {
            const options = getOutletOptions(params);
            logger.debug('Retrieving outlets...')
            return await Outlet.findAll(options);
        },
        /**
         * Retrieve a specific cuisine entity from the database via its private key.
         * @param id integer identifier matching the entity Primary Key
         * @returns {Promise<Outlets>}
         */
        async get(id) {
            logger.debug(`Getting outlet with id ${id}`)
            const foundOutlet = await Outlet.findByPk(id, getOutletOptions());
            if (!foundOutlet) {
                return null
            }
            return foundOutlet;
        },

        /**
         * Retrieve products associated with a given outlet id.
         * @param id integer matching the outlet foreign key
         * @param params object containing filtering options
         * @returns {Promise<Products[]>}
         */
        async findProducts(id, params) {
            logger.debug(`Finding products for outlet with id ${id}`)
            const foundOutlet = await Outlet.findByPk(id, getProductOptions(params));
            if (!foundOutlet) {
                return null
            }
            return foundOutlet;
        },

    };
};

export default createOutletStore;