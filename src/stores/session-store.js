/**
 * Data access layer for the Session model.
 * Gets the logger and database injected.
 * Methods: FIND, GET, CREATE.
 */
const createSessionStore = (logger, db) => {
    const Session = db.Sessions;
    // const options = {
    //     include: [
    //         {
    //             model: db.Images,
    //             as: 'image',
    //             attributes: {
    //                 exclude: ['id']
    //             }
    //         }
    //     ],
    //     attributes: {
    //         exclude: [
    //             'imageId',
    //         ]
    //     },
    // };

    return {
        /**
         * Retrieves all cuisine entities from the database.
         * @returns {Promise<Session[]>}
         */
        async find() {
            logger.debug('Retrieving sessions...')
            return await Session.findAll();
        },
        /**
         * Retrieve a specific cuisine entity from the database via its private key.
         * @param id integer identifier matching the entity Primary Key
         * @returns {Promise<Session>}
         */
        async get(id) {
            logger.debug(`Getting session with id ${id}`)
            const foundCuisine = await Session.findByPk(id);
            if (!foundCuisine) {
                return null
            }
            return foundCuisine;
        },

        /**
         * Creates new session
         * @returns {Promise<Session>}
         */
        async create() {
            const session = await Session.create();
            logger.debug(`Created new session`, session)
            return session;
        },

    };
};

export default createSessionStore;