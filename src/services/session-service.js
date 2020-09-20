import {BadRequest, NotFound} from 'fejl'

const assertId = BadRequest.makeAssert('No id given')

/**
 * Session service layer.
 * Gets a session store injected.
 */
export default class SessionService {
    constructor(sessionStore) {
        this.sessionStore = sessionStore;
    }

    /**
     * Fetch all sessions according to the given parameter.
     * @param params optional parameters to filter the result.
     * @returns {Promise<{result: Sessions[]}>}
     */
    async find(params) {
        const result = await this.sessionStore.find();
        return {result};
    }

    ø

    /**
     * Searches for a specific session by the given identifier.
     * @param id integer identifier
     * @returns {Promise<{result: Sessions}>}
     */
    async get(id) {
        assertId(id)
        const result = await this.sessionStore.get(id).then(
            NotFound.makeAssert(`Session with id "${id}" not found`)
        );
        return {result};
    }

    /**
     * Creates a new session
     * @returns {Promise<void>}
     */
    async create() {
        return this.sessionStore.create();
    }

}
