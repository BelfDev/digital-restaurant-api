import {BadRequest, NotFound} from 'fejl'

const assertId = BadRequest.makeAssert('No id given')
const assertSessionId = BadRequest.makeAssert('No sessionId given')

/**
 * Cart service layer.
 * Gets a cart store injected.
 */
export default class CartService {
    constructor(cartStore) {
        this.cartStore = cartStore;
    }

    // // TODO: Used internally by the backend
    // /**
    //  * Fetch all carts according to the given parameter.
    //  * @param ctx koa's context object
    //  * @returns {Promise<{result: Carts[]}>}
    //  */
    // async find(ctx) {
    //     const sessionId = ctx.session.id;
    //     assertSessionId(sessionId)
    //     const result = await this.cartStore.find(sessionId);
    //     return {result};
    // }

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
        const cart = await this.cartStore.get(id, sessionId).then(
            NotFound.makeAssert(`Cuisine with id "${id}" not found`)
        );
        const result = this._formatCartObject(cart);
        return {result};
    }

    /**
     * Updates the cart entity
     */
    async upsert(ctx) {
        const sessionId = ctx.session.id;
        const cartId = ctx.params.id;
        const body = ctx.request.body;
        if (sessionId && body) {
            const cartData = {sessionId, outletId: body.outletId}
            const updatedCart = await this.cartStore.upsert(cartId, cartData);
            let result = updatedCart;
            if (result) {
                result = {
                    id: updatedCart.id,
                    subtotal: updatedCart.subtotal,
                    status: updatedCart.status,
                    outletId: updatedCart.outletId
                }
            }
            return {result: result};
        }
        return ctx.throw(400);
    }

    /**
     * Updates or insert new cart item
     */
    async upsertCartItem(ctx) {
        const sessionId = ctx.session.id;
        const cartId = ctx.params.id;
        const body = ctx.request.body;
        assertSessionId(sessionId)

        if (body && body['items']) {

            const data = body['items'].map((item) => {
                return {
                    cartId: cartId,
                    productId: item.productId,
                    quantity: item.quantity,
                }
            });

            await this.cartStore.bulkUpsertCartItems(data);

            const cart = await this.cartStore.get(cartId, sessionId);

            const result = this._formatCartObject(cart);

            return {result};
        }
        return ctx.throw(400);
    }

    async deleteCartItems(ctx) {
        const sessionId = ctx.session.id;
        const cartId = ctx.params.id;
        const body = ctx.request.body;
        assertSessionId(sessionId)

        if (body && body['items']) {
            const data = body['items'].map((item) => {
                return {
                    cartId: cartId,
                    productId: item.productId,
                }
            });

            const result = await this.cartStore.bulkDeleteCartItems(data);
            return {result};
        }
        return ctx.throw(400);
    }

    _formatCartObject(cart) {
        let result = cart;
        if (cart['items']) {
            cart.items = cart.items.map((item) => {
                const newItem = item['dataValues'];
                delete newItem['cartItem'];
                return {
                    ...newItem,
                    ...item['cartItem']['dataValues']
                }
            })
        }
        return result;
    }

}
