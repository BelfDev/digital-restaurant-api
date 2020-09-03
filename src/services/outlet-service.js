import {BadRequest, NotFound} from 'fejl'

// Prefab assert function.
const assertId = BadRequest.makeAssert('No id given')

/**
 * Outlet service layer.
 * Gets an outlet store injected.
 */
export default class OutletService {
    constructor(outletStore, featuredStore) {
        this.outletStore = outletStore;
        this.featuredStore = featuredStore;
    }

    /**
     * Fetch all outlets according to the given parameter.
     * @param params optional parameters to filter the result.
     * @returns {Promise<{result: Outlets[]}>}
     */
    async find(params) {
        const result = await this.outletStore.find(params);
        return {result};
    }

    /**
     * Fetch all featured outlets according to the given parameter.
     * @param params optional parameters to filter the result.
     * @returns {Promise<{result: Outlets[]}>}
     */
    async findFeatured(params) {
        const result = await this.featuredStore.findFeaturedOutlets(params);
        return {result};
    }

    /**
     * Searches for a specific outlet by the given identifier.
     * @param id integer identifier
     * @returns {Promise<{result: Outlets}>}
     */
    async get(id) {
        assertId(id)
        const result = await this.outletStore.get(id).then(
            NotFound.makeAssert(`Outlet with id "${id}" not found`)
        );
        return {result};
    }

    /**
     * Fetch all products from a specific outlet id.
     * @param id integer identifier
     * @returns {Promise<{result: Outlets}>}
     */
    async findProducts(id) {
        assertId(id)
        const result = await this.outletStore.findProducts(id).then(
            NotFound.makeAssert(`Outlet with id "${id}" not found`)
        );
        return {result : result['products']};
    }

    /**
     * Fetch all featured products from a specific outlet id.
     * @param id integer identifier
     * @returns {Promise<{result: Outlets}>}
     */
    async findFeaturedProducts(id) {
        assertId(id)
        let params = {
            isFeatured: true
        }
        const result = await this.outletStore.findProducts(id, params).then(
            NotFound.makeAssert(`Outlet with id "${id}" not found`)
        );
        return {result : result['featuredProducts']};
    }

}
