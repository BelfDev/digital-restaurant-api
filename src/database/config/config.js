import {env} from '../../lib/env';
import options from './db-options.json';

module.exports = {
    url: env.DB_URL,
    dialect: 'postgres',
    ...options
}
