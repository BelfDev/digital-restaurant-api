/**
 * Data access layer for the Cart model.
 * Gets the logger and database injected.
 * Methods: FIND, GET.
 */
const createCartStore = (logger, db) => {
    const Cart = db.Carts;

    return {
        /**
         * Retrieves all cart entities from the database.
         * @returns {Promise<Carts[]>}
         */
        async find(sessionId) {
            logger.debug('Retrieving cuisines...')
            return await Cart.findAll({
                where: {
                    sessionId
                }
            });
        },

        /**
         * Retrieve a specific cart entity from the database via its private key.
         * @param id integer identifier matching the entity Primary Key
         * @returns {Promise<Carts>}
         */
        async get(id, sessionId) {
            logger.debug(`Getting cart with id ${id}`)
            const foundCart = await Cart.findByPk(id, {
                where: {
                    sessionId
                }
            });
            if (!foundCart) {
                return null
            }
            return foundCart;
        },

        /**
         * Create or update a cart entity
         * If an id is provided, this function will update an existing entry
         * @param id integer identifier matching the entity Primary Key
         * @param cartData object used to update the cart values
         * @returns {Promise<[Carts, (boolean | null)]|*>}
         */
        async upsert(id, cartData) {
            logger.debug(`Creating or updating cart`)
            const result =  await Cart.upsert(
                cartData,
                {
                    returning: true
                }
            )
            if (result && result.length > 0) {
                logger.debug(`Updated cart`, result)
                return result[0].dataValues;
            } else {
                return result;
            }

        },
    };
};

export default createCartStore;