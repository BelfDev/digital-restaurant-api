/**
 * Data access layer for the Payment model.
 * Gets the logger and database injected.
 * Methods: FIND, GET.
 */
const createPaymentStore = (logger, db) => {
    const Payment = db.Payments;
    const options = {
    };

    return {
        /**
         * Retrieves all payment entities from the database.
         * @returns {Promise<Payments[]>}
         */
        async find() {
            logger.debug('Retrieving cuisines...')
            return await Payment.findAll(options);
        },
        /**
         * Retrieve a specific payment entity from the database via its private key.
         * @param id integer identifier matching the entity Primary Key
         * @returns {Promise<Payments>}
         */
        async get(id) {
            logger.debug(`Getting payment with id ${id}`)
            const foundPayment = await Payment.findByPk(id, options);
            if (!foundPayment) {
                return null
            }
            return foundPayment.dataValues;
        },
        /**
         * Creates a single payment
         * @returns {Promise<Payments>}
         */
        async create(data) {
            logger.debug(`Creating new payment`);
            const result = await Payment.create(data);
            if (result) {
                logger.debug(`Payment created!`);
            }
            return result.dataValues;
        },

    };
};

export default createPaymentStore;