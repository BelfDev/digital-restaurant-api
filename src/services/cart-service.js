import {BadRequest, NotFound} from 'fejl'

// Prefab assert function.
const assertId = BadRequest.makeAssert('No id given')
const assertSessionId = BadRequest.makeAssert('No sessionId given')

/**
 * Cuisine service layer.
 * Gets a cuisine store injected.
 */
export default class CartService {
    constructor(cartStore) {
        this.cartStore = cartStore;
    }

    /**
     * Fetch all carts according to the given parameter.
     * @param ctx koa's context object
     * @returns {Promise<{result: Carts[]}>}
     */
    async find(ctx) {
        const sessionId = ctx.session.id;
        assertSessionId(sessionId)
        const result = await this.cartStore.find(sessionId);
        return {result};
    }
    ø
    /**
     * Searches for a specific cart by the given identifier.
     * @param ctx koa's context object
     * @returns {Promise<{result: Carts}>}
     */
    async get(ctx) {
        const id = ctx.params.id;
        const sessionId = ctx.session.id;
        assertId(id)
        assertSessionId(sessionId)
        const result = await this.cartStore.get(id, sessionId).then(
            NotFound.makeAssert(`Cuisine with id "${id}" not found`)
        );
        return {result};
    }

    /**
     * Updates the cart entity
     */
    async upsert(ctx) {
        const sessionId = ctx.session.id;
        const body = ctx.request.body;
        if (sessionId && body) {
            const cartData = {sessionId, outletId: body.outletId, subtotal: body.subtotal}
            if (body.id) {
                cartData.id = body.id;
            }
            const updatedCart = await this.cartStore.upsert(body.cartId, cartData);
            return {result: updatedCart};
        }
        return ctx.throw(400);
    }

}
