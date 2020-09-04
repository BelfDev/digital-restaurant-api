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
        this.logger.debug('Creating user account');
        return this.passport.authenticate('signup', async (err, user) => {
            if (err) {
                this.logger.debug('Failed to create new user account.', err.message);
                ctx.throw(401, err.message)
            } else {
                const { userId, email, createdOn } = user.dataValues;
                this.logger.debug('Created new user account: ', email);
                ctx.body = {
                    user: {
                        userId,
                        email,
                        createdOn
                    }
                }
            }
        })(ctx)
    }
}
