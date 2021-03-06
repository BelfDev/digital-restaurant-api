import {BadRequest, NotFound} from 'fejl'

// Prefab assert function.
const assertId = BadRequest.makeAssert('No id given')

/**
 * Cuisine service layer.
 * Gets a cuisine store injected.
 */
export default class CuisineService {
    constructor(cuisineStore) {
        this.cuisineStore = cuisineStore;
    }

    /**
     * Fetches all cuisines according to the given parameter.
     * @param params optional parameters to filter the result.
     * @returns {Promise<{result: Cuisines[]}>}
     */
    async find(params) {
        const result = await this.cuisineStore.find();
        return {result};
    }

    /**
     * Searches for a specific cuisine by the given identifier.
     * @param id integer identifier
     * @returns {Promise<{result: Cuisines}>}
     */
    async get(id) {
        assertId(id)
        const result = await this.cuisineStore.get(id).then(
            NotFound.makeAssert(`Cuisine with id "${id}" not found`)
        );
        return {result};
    }
}
