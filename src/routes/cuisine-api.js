import {createController} from 'awilix-koa'
// import passport from 'koa-passport';

/**
 * Cuisine API controller.
 * This file contains functions which map HTTP calls to CuisineService methods.
 */
const api = cuisineService => ({
    findCuisines: async ctx => ctx.ok(await cuisineService.find(ctx.query)),
    getCuisine: async ctx => ctx.ok(await cuisineService.get(ctx.params.id)),
});

/**
 * Maps routes to method calls on the API controller (above).
 */
export default createController(api)
    .prefix('/cuisines')
    .get('', 'findCuisines', {
        // Authentication example
        // before: passport.authenticate('jwt', { session : false })
    })
    .get('/:id', 'getCuisine');
