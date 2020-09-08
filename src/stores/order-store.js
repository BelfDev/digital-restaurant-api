/**
 * Data access layer for the Order model.
 * Gets the logger and database injected.
 * Methods: FIND, GET.
 */
const createOrderStore = (logger, db) => {
    const Order = db.Orders;
    const OrderCarts = db.OrderCarts;
    const options = {
        include: [
            {
                model: db.Carts,
                as: 'carts',
                include: [
                    {
                        model: db.Products,
                        as: 'items',
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
                through: {attributes: []},
            },
        ],
        attributes: {
            exclude: [
                'createdOn',
                'updatedOn'
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
            return foundOrder.dataValues;
        },
        /**
         * Updates an order status
         * @param id integer identifier matching the entity Primary Key
         * @param status order status
         * @returns {Promise<this>}
         */
        async updateOrderStatus(id, status) {
            logger.debug(`Updating order`);
            const order = await  Order.findByPk(id);
            order.status = status;
            const result = await order.save();
            if (result) {
                logger.debug(`Order updated!`);
            }
            return result;
        },
        /**
         * Creates a single order
         * @returns {Promise<Orders>}
         */
        async create() {
            logger.debug(`Creating new order`);
            const result = await Order.create();
            if (result) {
                logger.debug(`Order created!`);
            }
            return result;
        },
        /**
         * Creates carts
         * @param items
         * @returns {Promise<OrderCarts[]>}
         */
        async bulkAssociateCarts(items) {
            logger.debug(`Creating order carts in bulk`);
            const result = await OrderCarts.bulkCreate(
                items,
            )
            if (result) {
                logger.debug(`Carts added!`);
            }
            return result;
        },
    };
};

export default createOrderStore;