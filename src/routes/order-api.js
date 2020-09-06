import {createController} from 'awilix-koa'

/**
 * Cuisine API controller abstraction.
 * This file contains functions that map HTTP calls to the OrderService.
 */
const api = orderService => ({
    findOrders: async ctx => ctx.ok(await orderService.find(ctx.query)),
    getOrder: async ctx => ctx.ok(await orderService.get(ctx.params.id)),
});

/**
 * Maps routes to method calls on the API controller (above).
 */
export default createController(api)
    .prefix('/orders')
    .get('', 'findOrders')
    .get('/:id', 'getOrder');
