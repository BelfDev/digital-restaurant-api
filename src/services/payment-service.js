import {BadRequest, NotFound} from 'fejl'

// Prefab assert function.
const assertId = BadRequest.makeAssert('No id given')
const assertSessionId = BadRequest.makeAssert('No sessionId given')
const assertCartId = BadRequest.makeAssert('No cartId given')

/**
 * Payment service layer.
 * Gets a payment store injected.
 */
export default class PaymentService {
    constructor(paymentStore) {
        this.paymentStore = paymentStore;
    }

    /**
     * Fetch all payments according to the given parameter.
     * @param params optional parameters to filter the result.
     * @returns {Promise<{result: Payments[]}>}
     */
    async find(params) {
        const result = await this.paymentStore.find();
        return {result};
    }

    /**
     * Searches for a specific payment by the given identifier.
     * @param id integer identifier
     * @returns {Promise<{result: Payments}>}
     */
    async get(id) {
        assertId(id)
        const result = await this.paymentStore.get(id).then(
            NotFound.makeAssert(`Payment with id "${id}" not found`)
        );
        return {result};
    }


    async create(ctx) {
        const sessionId = ctx.session.id;
        const body = ctx.request.body;

        assertSessionId(sessionId);

        if (body['orderId'] && body['paymentMethodId']) {

            const data = {
                sessionId,
                orderId: body.orderId,
                paymentMethodId: body.paymentMethodId,
            }

            const result = await this.paymentStore.create(data);
            if (result) {
                return {
                    result: {
                        id: result.id,
                        total: result.total,
                        orderId: result.orderId,
                        paymentMethodId: result.paymentMethodId
                    }
                }
            }
        }

        return ctx.throw(400);
    }

}
