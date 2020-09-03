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

    const getOptions = (params) => {
        let locationCondition;
        if (params)
            locationCondition = buildLocationCondition(params.city);
        return {
            include: [
                {
                    model: db.Cuisines,
                    as: 'cuisine',
                    attributes: {
                        exclude: ['id', 'imageId']
                    },
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

    return {
        /**
         * Retrieves all outlet entities from the database.
         * @returns {Promise<Outlets[]>}
         */
        async find(params) {
            const options = getOptions(params);
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
            const foundOutlet = await Outlet.findByPk(id, options);
            if (!foundOutlet) {
                return null
            }
            return foundOutlet;
        },

        /**
         * Retrieve products associated with a given outlet id.
         * @param id integer matching the outlet foreign key
         * @returns {Promise<Products[]>}
         */
        async findProducts(id) {
            logger.debug(`Finding products for outlet with id ${id}`)
            const foundProducts = await Outlet.findByPk(id, options);
            if (!foundProducts) {
                return null
            }
            return foundOutlet;
        },

        /**
         * Retrieve featured products associated with a given outlet id.
         * @param id integer matching the outlet foreign key
         * @returns {Promise<Products[]>}
         */
        async findFeaturedProducts(id) {
            logger.debug(`Finding featured products for outlet with id ${id}`)
            const foundProducts = await Outlet.findByPk(id, options);
            if (!foundProducts) {
                return null
            }
            return foundOutlet;
        },
    };
};

export default createOutletStore;