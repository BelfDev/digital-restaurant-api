import {createController} from 'awilix-koa'

/**
 * Outlet API controller.
 * This file contains functions which map HTTP calls to OutletService methods.
 */
const api = outletService => ({
    findOutlets: async ctx => ctx.ok(await outletService.find(ctx.query)),
    findFeaturedOutlets: async ctx => ctx.ok(await outletService.findFeatured(ctx.query)),
    getOutlet: async ctx => ctx.ok(await outletService.get(ctx.params.id)),
    findOutletProducts: async ctx => ctx.ok(await outletService.findProducts(ctx.params.id)),
    findOutletFeaturedProducts: async ctx => ctx.ok(await outletService.findFeaturedProducts(ctx.params.id)),
});

/**
 * Maps routes to method calls on the API controller (above).
 */
export default createController(api)
    .prefix('/outlets')
    .get('', 'findOutlets')
    .get('/featured', 'findFeaturedOutlets')
    .get('/:id', 'getOutlet')
    .get('/:id/products', 'findOutletProducts')
    .get('/:id/products/featured', 'findOutletFeaturedProducts');
