import {createController} from 'awilix-koa'
import bodyParser from "koa-bodyparser";

/**
 * Cuisine API controller.
 * This file contains functions that map HTTP calls to CartService methods.
 */
const api = cartService => ({
    // findCarts: async ctx => ctx.ok(await cartService.find(ctx)),
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
    // .get('', 'findCarts')
    .get('/:id', 'getCart')
    .post('', 'createOrUpdateCart', {
        before: [bodyParser()]
    })
    .post('/:id', 'createOrUpdateCart', {
        before: [bodyParser()]
    })
    .post('/:id/items', 'createOrUpdateCartItem', {
        before: [bodyParser()]
    })
    .delete('/:id/items', 'deleteCartItems');
