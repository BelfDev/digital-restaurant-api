import {BadRequest, NotFound} from 'fejl'

// Prefab assert function.
const assertId = BadRequest.makeAssert('No id given')

/**
 * Outlet service layer.
 * Gets an outlet store injected.
 */
export default class OutletService {
    constructor(outletStore) {
        this.outletStore = outletStore;
    }

    /**
     * Fetch all outlets according to the given parameter.
     * @param params optional parameters to filter the result.
     * @returns {Promise<*>}
     */
    async find(params) {
        const result = await this.outletStore.find(params);
        return {result};
    }

    /**
     * Searches for a specific outlet by the given identifier.
     * @param id integer identifier
     * @returns {Promise<*>}
     */
    async get(id) {
        assertId(id)
        const result = await this.outletStore.get(id).then(
            NotFound.makeAssert(`Outlet with id "${id}" not found`)
        );
        return {result};
    }
}
