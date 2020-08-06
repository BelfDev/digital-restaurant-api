import {env} from '../../lib/env';

const baseConfig = {
    url: env.DB_URL,
    dialect: 'postgres',
}

const config = {
    development: {
        ...baseConfig
    },
    test: {
        ...baseConfig
    },
    production: {
        ...baseConfig
    },
};

export default config;