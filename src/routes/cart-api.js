import {createController} from 'awilix-koa'
import bodyParser from "koa-bodyparser";

/**
 * Cuisine API controller abstraction.
 * This file contains functions that map HTTP calls to the CartService.
 */
const api = cartService => ({
    findCarts: async ctx => ctx.ok(await cartService.find(ctx)),
    getCart: async ctx => ctx.ok(await cartService.get(ctx)),
    createOrUpdateCart: async ctx => ctx.ok(await cartService.upsert(ctx)),
    createOrUpdateCartItem: async ctx => ctx.ok(await cartService.upsertCartItem(ctx)),
    deleteCartItems: async ctx => ctx.ok(await cartService.deleteCartItems(ctx)),
});

/**
 * Maps routes to method calls on the API controller (above).
 */
export default createController(api)
    .prefix('/carts')
    .get('', 'findCarts')
    .get('/:id', 'getCart')
    .post('', 'createOrUpdateCart', {
        // Maps `POST /todos` to the `createTodo` function on the returned object from `API`
        before: [bodyParser()] // Runs the bodyParser just for this endpoint
    })
    .post('/:id', 'createOrUpdateCart', {
        // Maps `POST /todos` to the `createTodo` function on the returned object from `API`
        before: [bodyParser()] // Runs the bodyParser just for this endpoint
    })
    .post('/:id/items', 'createOrUpdateCartItem', {
        // Maps `POST /todos` to the `createTodo` function on the returned object from `API`
        before: [bodyParser()] // Runs the bodyParser just for this endpoint
    })
    .delete('/:id/items', 'deleteCartItems');
