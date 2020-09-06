/**
 * Data access layer for the Cart model.
 * Gets the logger and database injected.
 * Methods: FIND, GET.
 */
const createCartStore = (logger, db) => {
    const Cart = db.Carts;
    const CartItem = db.CartItems;

    const options = {
        include: [
            {
                model: db.Products,
                as: 'items',
                attributes: {
                    exclude: ['id']
                },
                through: {
                    as: 'cartItem',
                    attributes: {
                        exclude: ['id', 'cartId', 'productId']
                    },

                }
            }
        ],
        attributes: {
            exclude: [
                'cartItemId', 'outletId', 'sessionId', 'createdOn', 'updatedOn',
            ]
        },
    };

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
         * @param sessionId
         * @returns {Promise<Carts>}
         */
        async get(id, sessionId) {
            logger.debug(`Getting cart with id ${id}`)
            const foundCart = await Cart.findByPk(id, {
                ...options,
                where: {
                    sessionId
                }
            });
            if (!foundCart) {
                return null
            }
            return foundCart.dataValues;
        },

        /**
         * Create or update a cart entity
         * If an id is provided, this function will update an existing entry
         * @param cartId id integer identifier matching the entity Primary Key
         * @param cartData object used to update the cart values
         * @returns {Promise<[Carts, (boolean | null)]|*>}
         */
        async upsert(cartId, cartData) {
            logger.debug(`Creating or updating cart`)
            const values = cartData;
            if (cartId)
                values['id'] = cartId;

            const result =  await Cart.upsert(
                {
                    ...values,
                    ...cartData
                },
                {
                    ...options,
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

        /**
         * Create or update cart items
         * @param items
         * @returns {Promise<CartItems[]>}
         */
        async bulkUpsertCartItems(items) {
            logger.debug(`Creating or updating cart items in bulk`);
            const result =  await CartItem.bulkCreate(
                items,
                {
                    updateOnDuplicate: ['quantity', 'total', 'status']
                }
            )
            if (result) {
                logger.debug(`Cart items updated!`);
            }
            return result;
        },

        /**
         * Delete cart items
         * @param items
         * @returns {Promise<number>}
         */
        async bulkDeleteCartItems(items) {
            logger.debug(`Deleting cart items in bulk`);
            const cartId = items[0].cartId;
            const productIds = items.map((item) => item.productId);
            const result = await CartItem.destroy(
                {
                    where: {
                        cartId,
                        productId: productIds
                    }
                }
            )
            if (result) {
                logger.debug(`Cart items deleted!`);
            }
            return result;
        },

    };
};

export default createCartStore;