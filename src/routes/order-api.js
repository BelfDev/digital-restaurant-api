import {createController} from 'awilix-koa'
import bodyParser from "koa-bodyparser";

/**
 * Orders API controller abstraction.
 * This file contains functions that map HTTP calls to the OrderService.
 */
const api = orderService => ({
    findOrders: async ctx => ctx.ok(await orderService.find(ctx.query)),
    getOrder: async ctx => ctx.ok(await orderService.get(ctx.params.id)),
    createOrder: async ctx => ctx.ok(await orderService.createOrder(ctx)),
    addCarts: async ctx => ctx.ok(await orderService.addCarts(ctx)),
});

/**
 * Maps routes to method calls on the API controller (above).
 */
export default createController(api)
    .prefix('/orders')
    .get('', 'findOrders')
    .get('/:id', 'getOrder')
    .post('/', 'createOrder', {
        // Maps `POST /todos` to the `createTodo` function on the returned object from `API`
        before: [bodyParser()] // Runs the bodyParser just for this endpoint
    })
    .post('/carts', 'addCarts', {
        before: [bodyParser()]
    })
    .post('/:id/carts', 'addCarts', {
        before: [bodyParser()]
    });
