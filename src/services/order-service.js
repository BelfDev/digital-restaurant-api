import {BadRequest, NotFound} from 'fejl'

const assertId = BadRequest.makeAssert('No id given')
const assertSessionId = BadRequest.makeAssert('No sessionId given')

/**
 * Order service layer.
 * Gets a order store injected.
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

    /**
     * Adds carts to an order
     * sessionId and carts must be passed
     * if orderId is omitted from the query parameters, a new order is created
     */
    async addCarts(ctx) {
        const sessionId = ctx.session.id;
        const body = ctx.request.body;

        let orderId = ctx.params.id;

        assertSessionId(sessionId);

        if (!orderId) {
            const order = await this.orderStore.create();
            orderId = order.id;
        }

        if (body && body['carts']) {
            const data = body['carts'].map((item) => {
                return {
                    cartId: item.id,
                    orderId: orderId,
                }
            });

            await this.orderStore.bulkAssociateCarts(data);

            const order = await this.orderStore.get(orderId);

            const result = this._formatOrderObject(order);

            return {result};
        }

        return ctx.throw(400);
    }

    _formatOrderObject(order) {
        let result = order;
        if (order['carts']) {
            result.carts = order.carts.map((cart) => this._formatCartObject(cart))
        }
        return result;
    }

    _formatCartObject(cart) {
        let result = cart.dataValues;
        if (cart['items']) {
            result.items = cart.items.map((item) => {
                const newItem = item.dataValues;
                delete newItem['cartItem'];
                return {
                    ...newItem,
                    ...item['cartItem'].dataValues
                }
            })
        }
        return result;
    }

}
