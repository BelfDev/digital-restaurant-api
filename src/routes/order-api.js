import {createController} from 'awilix-koa'
import bodyParser from "koa-bodyparser";

/**
 * Cuisine API controller abstraction.
 * This file contains functions that map HTTP calls to the OrderService.
 */
const api = orderService => ({
    findOrders: async ctx => ctx.ok(await orderService.find(ctx.query)),
    getOrder: async ctx => ctx.ok(await orderService.get(ctx.params.id)),
    createOrder: async ctx => ctx.ok(await orderService.createOrder(ctx)),
    updateOrder: async ctx => ctx.ok(await orderService.updateOrder(ctx)),
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
    .patch('/:id', 'updateOrder', {
        // Maps `POST /todos` to the `createTodo` function on the returned object from `API`
        before: [bodyParser()] // Runs the bodyParser just for this endpoint
    })
    .post('/carts', 'addCarts', {
        // Maps `POST /todos` to the `createTodo` function on the returned object from `API`
        before: [bodyParser()] // Runs the bodyParser just for this endpoint
    })
    .post('/:id/carts', 'addCarts', {
        // Maps `POST /todos` to the `createTodo` function on the returned object from `API`
        before: [bodyParser()] // Runs the bodyParser just for this endpoint
    });
