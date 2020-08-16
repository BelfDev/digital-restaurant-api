/**
 * Data access layer for the Cuisine model.
 * Gets the logger and database injected.
 * Methods: FIND, GET.
 */
const createCuisineStore = (logger, db) => {
    const Cuisine = db.Cuisines;
    const options = {
        include: [
            {
                model: db.Images,
                as: 'image',
                attributes: {
                    exclude: ['id']
                }
            }
        ],
        attributes: {
            exclude: [
                'imageId',
            ]
        },
    };

    return {
        /**
         * Retrieves all cuisine entities from the database.
         * @returns {Promise<Cuisines[]>}
         */
        async find() {
            logger.debug('Retrieving cuisines...')
            return await Cuisine.findAll(options);
        },
        /**
         * Retrieve a specific cuisine entity from the database via its private key.
         * @param id integer identifier matching the entity Primary Key
         * @returns {Promise<Cuisines>}
         */
        async get(id) {
            logger.debug(`Getting cuisine with id ${id}`)
            const foundCuisine = await Cuisine.findByPk(id, options);
            if (!foundCuisine) {
                return null
            }
            return foundCuisine;
        },
    };
};

export default createCuisineStore;