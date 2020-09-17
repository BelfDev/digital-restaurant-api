import bodyParser from 'koa-bodyparser'
import {createController} from 'awilix-koa'

/**
 * Session API controller abstraction.
 * This file contains functions that map HTTP calls to the SessionService.
 */
const api = sessionService => ({
    findSessions: async ctx => ctx.ok(await sessionService.find(ctx.query)),
    getSession: async ctx => ctx.ok(await sessionService.get(ctx.params.id)),
    createSession: async ctx => ctx.created(await sessionService.create(ctx.request.body)),
});

/**
 * Maps routes to method calls on the API controller (above).
 */
export default createController(api)
    .prefix('/session')
    .get('', 'findSessions')
    .get('/:id', 'getSession')
    .post('', 'createSession', {
        // Maps `POST /todos` to the `createTodo` function on the returned object from `API`
        before: [bodyParser()] // Runs the bodyParser just for this endpoint
    });
