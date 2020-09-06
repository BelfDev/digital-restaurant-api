/**
 * Data access layer for the Order model.
 * Gets the logger and database injected.
 * Methods: FIND, GET.
 */
const createOrderStore = (logger, db) => {
    const Order = db.Orders;
    const options = {
        include: [
            {
                model: db.Images,
                as: 'image',
                attributes: {
                    exclude: ['id']
                }
            }
        ],
        attributes: {
            exclude: [
                'imageId',
            ]
        },
    };

    return {
        /**
         * Retrieves all order entities from the database.
         * @returns {Promise<Orders[]>}
         */
        async find() {
            logger.debug('Retrieving cuisines...')
            return await Order.findAll(options);
        },
        /**
         * Retrieve a specific order entity from the database via its private key.
         * @param id integer identifier matching the entity Primary Key
         * @returns {Promise<Orders>}
         */
        async get(id) {
            logger.debug(`Getting order with id ${id}`)
            const foundOrder = await Order.findByPk(id, options);
            if (!foundOrder) {
                return null
            }
            return foundOrder;
        },
    };
};

export default createOrderStore;