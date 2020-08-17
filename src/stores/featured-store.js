/**
 * Data access layer for the Featured model.
 * Gets the logger and database injected.
 * Methods: FIND
 */
const createFeaturedStore = (logger, db) => {
    const FeaturedOutlet = db.FeaturedOutlets;

    const buildLocationCondition = (city) => city ? {
            where: {
                city: city
            }
        } : {};

    const getOptions = (params) => {
        let locationCondition;
        if (params)
            locationCondition = buildLocationCondition(params.city);
        return {
            include: [
                {
                    model: db.Outlets,
                    required: true,
                    as: 'outlet',
                    attributes: {
                        exclude: ['cuisineId', 'locationId']
                    },
                    include: [
                        {
                            model: db.Cuisines,
                            as: 'cuisine',
                            attributes: {
                                exclude: ['id', 'imageId']
                            },
                        },
                        {
                            model: db.Locations,
                            as: 'location',
                            attributes: {
                                exclude: ['id']
                            },
                            ...locationCondition
                        },
                        {
                            model: db.Images,
                            as: 'images',
                            attributes: {
                                exclude: ['id']
                            },
                            through: {attributes: []}
                        }
                    ],
                },
            ],
            attributes: {
                exclude: ['outletId', 'locationId']
            },
        };
    };

    return {
        /**
         * Retrieves all (featured) outlet entities from the database.
         * @returns {Promise<Outlets[]>}
         */
        async find(params) {
            const options = getOptions(params);
            logger.debug('Retrieving outlets...')
            return await FeaturedOutlet.findAll(options)
                .then((result) => result.map(r => r.outlet));
        },
    };
};

export default createFeaturedStore;