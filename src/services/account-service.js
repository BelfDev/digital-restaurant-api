import jwt from 'jsonwebtoken';

/**
 * Account service layer.
 * Gets the passport and logger injected.
 */
export default class AccountService {
    constructor(passport, logger) {
        this.passport = passport;
        this.logger = logger;
    }

    async login(ctx) {
        return this.passport.authenticate('login', async (err, user) => {
            if (err || !user) {
                this.logger.debug('Failed to login');
                const error = new Error('An Error occurred')
                ctx.throw(401, error)
            }

            const userData = user.dataValues;
            this.logger.debug('Logging user');
            return ctx.login(user)
                .then(() => {
                    const {userId, email, createdOn} = userData;
                    const body = {userId, email, createdOn}
                    const token = jwt.sign({user: body}, 'top_secret');
                    ctx.body = {
                        result: {
                            userId,
                            email,
                            token
                        }
                    };
                });
        })(ctx)
    }

    async logout(ctx) {
        this.logger.debug('Logging out user', ctx.state.user);
        ctx.body = {};
        return ctx.logout();
    }

    async create(ctx) {
        this.logger.debug('Creating user account');
        return this.passport.authenticate('signup', {session: false}, async (err, user) => {
            if (err) {
                this.logger.debug('Failed to create new user account.', err.message);
                ctx.throw(401, err.message)
            } else {
                const {email} = user.dataValues;
                this.logger.debug('Created new user account: ', email);
                return this.login(ctx);
            }
        })(ctx)
    }
}
