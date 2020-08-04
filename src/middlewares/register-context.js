import {asValue} from 'awilix'

/**
 * Adds request-specific data to the scope.
 */
export async function registerContext(ctx, next) {
    ctx.state.container.register({
        userContext: asValue({
            user: 'username'
        })
    })
    return next()
}
