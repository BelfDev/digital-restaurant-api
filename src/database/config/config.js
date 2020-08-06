import {env} from '../../lib/env';
import options from './db-options.json';

const baseConfig = {
    url: env.DB_URL,
    dialect: 'postgres',
    ...options
}

const config = {
    development: {
        ...baseConfig,
    },
    test: {
        ...baseConfig
    },
    production: {
        ...baseConfig
    },
};

export default config;