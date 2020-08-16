/**
 * Data access layer for the Outlet model.
 * Gets the logger and database injected.
 * Methods: FIND, GET, CREATE, UPDATE, REMOVE.
 */
const createCuisineStore = (logger, db) => {
    const Outlet = db.Outlets;
    const options = {
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
                }
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
    };

    return {
        /**
         * Retrieves all outlet entities from the database.
         * @returns {Promise<Outlets[]>}
         */
        async find() {
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
    };
};

export default createCuisineStore;