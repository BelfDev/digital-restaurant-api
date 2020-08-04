import {createController} from 'awilix-koa'

/**
 *
 * API controller abstraction. This file contains utility functions
 * to map HTTP calls to services.
 */
const api = dummyService => ({
    findTodos: async ctx => ctx.ok(await dummyService.find(ctx.query)),
    getTodo: async ctx => ctx.ok(await dummyService.get(ctx.params.id)),
    createTodo: async ctx =>
        ctx.created(await dummyService.create(ctx.request.body)),
    updateTodo: async ctx =>
        ctx.ok(await dummyService.update(ctx.params.id, ctx.request.body)),
    removeTodo: async ctx =>
        ctx.noContent(await dummyService.remove(ctx.params.id))
})

/**
 * Maps routes to method calls on the API controller (above).
 */
export default createController(api)
    .prefix('/todos')
    .get('', 'findTodos')
    .get('/:id', 'getTodo')
    .post('', 'createTodo')
    .patch('/:id', 'updateTodo')
    .delete('/:id', 'removeTodo')
