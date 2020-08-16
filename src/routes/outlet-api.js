import {createController} from 'awilix-koa'

/**
 * Outlet API controller abstraction.
 * This file contains functions that map HTTP calls to the OutletService.
 */
const api = outletService => ({
    findOutlets: async ctx => ctx.ok(await outletService.find(ctx.query)),
    getOutlet: async ctx => ctx.ok(await outletService.get(ctx.params.id)),
});

/**
 * Maps routes to method calls on the API controller (above).
 */
export default createController(api)
    .prefix('/outlets')
    .get('', 'findOutlets')
    .get('/:id', 'getOutlet');
