import {BadRequest, NotFound} from 'fejl';
import jwt from 'jsonwebtoken';

// Prefab assert function.
const assertId = BadRequest.makeAssert('No id given')

/**
 * Cuisine service layer.
 * Gets a cuisine store injected.
 */
export default class AccountService {
    constructor(passport, logger) {
        this.passport = passport;
        this.logger = logger;
    }

    async login(ctx) {
        return this.passport.authenticate('login', async (err, user, info, status) => {
            if (user === false) {
                ctx.body = { success: false }
                ctx.throw(401)
            } else {
                ctx.body = { success: true }
                return ctx.login(user, {session : false})
            }
        })(ctx)
    }

    async create(ctx) {
        return this.passport.authenticate('signup', async (err, user, info, status) => {
            this.logger.debug('Creating user account');

            // if (user === false) {
            //     ctx.body = { success: false }
            //     ctx.throw(401)
            // } else {
            //     ctx.body = { success: true }
            //     return ctx.login(user, {session : false})
            // }

        })(ctx)
    }

}
