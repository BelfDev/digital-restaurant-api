import {BadRequest, NotFound} from 'fejl'

// Prefab assert function.
const assertId = BadRequest.makeAssert('No id given')

/**
 * Order service layer.
 * Gets a cuisine store injected.
 */
export default class OrderService {
    constructor(orderStore) {
        this.orderStore = orderStore;
    }

    /**
     * Fetch all orders according to the given parameter.
     * @param params optional parameters to filter the result.
     * @returns {Promise<{result: Cuisines[]}>}
     */
    async find(params) {
        const result = await this.orderStore.find();
        return {result};
    }
    ø
    /**
     * Searches for a specific order by the given identifier.
     * @param id integer identifier
     * @returns {Promise<{result: Cuisines}>}
     */
    async get(id) {
        assertId(id)
        const result = await this.orderStore.get(id).then(
            NotFound.makeAssert(`Order with id "${id}" not found`)
        );
        return {result};
    }
}
