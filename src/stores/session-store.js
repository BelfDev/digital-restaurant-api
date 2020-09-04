/**
 * Data access layer for the Session model.
 * Gets the logger and database injected.
 * Methods: FIND, GET, CREATE.
 */
const createSessionStore = (logger, db) => {
    const Session = db.Sessions;

    return {

        /**
         * Retrieve a specific cuisine entity from the database via its private key.
         * @param id integer identifier matching the entity Primary Key
         * @returns Session
         */
        async get(id) {
            logger.debug(`Getting session with id ${id}`)
            const foundSession = await Session.findByPk(id);
            if (!foundSession) {
                return null
            }
            return foundSession;
        },

        /**
         * Creates new session.
         * @returns Session
         */
        async create() {
            const session = await Session.create();
            logger.debug(`Created new session`, session.dataValues)
            return session;
        },

        /**
         * Deletes session with the given identifier.
         * * @param id integer identifier matching the entity Primary Key
         */
        async destroy(id) {
            const session = await Session.findByPk(id);
            if (session != null) {
                logger.debug(`Deleting session`, session);
                await session.destroy();
            } else {
                logger.debug(`Trying to delete the session but it is already null`);
            }
        },

    };
};

export default createSessionStore;