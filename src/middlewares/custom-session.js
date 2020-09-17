import {logger} from '../lib/logger'
import db from '../database/models'
import ms from 'ms'
import createSessionStore from '../stores/session-store'

/**
 * Session handler middleware.
 */
module.exports = () => {
    const store = createSessionStore(logger, db);
    const sessionIdKey = 'Session-Id';
    // const ttl = ms("45 minutes");
    const ttl = ms("1s");

    return async (ctx, next) => {

        // Extract the session id from the header
        let sid = ctx.get(sessionIdKey);
        let shouldRefresh = false;

        // Initializes a session
        if (!sid) {
            // No SID; generates empty session
            ctx.session = {};
            shouldRefresh = true;
        } else {
            // SID; fetches the session from the store
            ctx.session = await store.get(sid);

            // Regenerating session if id was not found
            if (ctx.session == null) {
                shouldRefresh = true;
            } else {
                ctx.set(sessionIdKey, ctx.session.id);
            }

            // Session must always be a no-null object
            if (typeof ctx.session !== 'object' || ctx.session == null) {
                ctx.session = {};
            } else {
                // Evaluate if time to live has expired
                const expiry = (ctx.session.createdOn.getTime() + ttl);
                shouldRefresh = Date.now() - expiry >= 0;
            }

        }

        // Adds refresh function
        ctx.session.refresh = () => {
            shouldRefresh = true
        }

        await next();

        // remove refresh function
        if (ctx.session && 'refresh' in ctx.session) {
            delete ctx.session.refresh
        }

        // Clear old session
        if (sid && shouldRefresh) {
            await store.destroy(sid);
        }

        if (shouldRefresh) {
            // Set session
            ctx.session = await store.create();
            ctx.set(sessionIdKey, ctx.session.id);
            shouldRefresh = false
        }

    }

};
