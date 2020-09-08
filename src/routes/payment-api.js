import {createController} from 'awilix-koa'
import bodyParser from "koa-bodyparser";

/**
 * Payment API controller abstraction.
 * This file contains functions that map HTTP calls to the OrderService.
 */
const api = paymentService => ({
    findPayments: async ctx => ctx.ok(await paymentService.find(ctx.query)),
    getPayment: async ctx => ctx.ok(await paymentService.get(ctx.params.id)),
    createPayment: async ctx => ctx.ok(await paymentService.createPayment(ctx)),
});

/**
 * Maps routes to method calls on the API controller (above).
 */
export default createController(api)
    .prefix('/orders')
    .get('', 'findPayments')
    .get('/:id', 'getPayment')
    .post('/', 'createPayment', {
        // Maps `POST /todos` to the `createTodo` function on the returned object from `API`
        before: [bodyParser()] // Runs the bodyParser just for this endpoint
    });