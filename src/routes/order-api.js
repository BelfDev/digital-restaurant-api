import {createController} from 'awilix-koa'
import bodyParser from "koa-bodyparser";

/**
 * Orders API controller.
 * This file contains functions that map HTTP calls to OrderService methods.
 */
const api = orderService => ({
    // findOrders: async ctx => ctx.ok(await orderService.find(ctx.query)),
    getOrder: async ctx => ctx.ok(await orderService.get(ctx.params.id)),
    addCarts: async ctx => ctx.ok(await orderService.addCarts(ctx)),
});

/**
 * Maps routes to method calls on the API controller (above).
 */
export default createController(api)
    .prefix('/orders')
    // .get('', 'findOrders')
    .get('/:id', 'getOrder')
    .post('/carts', 'addCarts', {
        before: [bodyParser()]
    })
    .post('/:id/carts', 'addCarts', {
        before: [bodyParser()]
    });
