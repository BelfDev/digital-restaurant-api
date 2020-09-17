import {asValue, createContainer, InjectionMode, Lifetime} from 'awilix';
import {logger} from './logger';
import db from '../database/models';
import passport from 'koa-passport';

/**
 * Loads modules with Awilix dependency injection library.
 */
const modulesToLoad = [
    // Each request gets a scoped (separate instance) of the service.
    ['services/*.js', Lifetime.SCOPED],
    // Stores are singletons; one per process.
    ['stores/*.js', Lifetime.SINGLETON]
]

/**
 * Configures a new container.
 *
 * @return {Object} The container.
 */
export function configureContainer() {
    const opts = {
        injectionMode: InjectionMode.CLASSIC
    }
    return createContainer(opts)
        .loadModules(modulesToLoad, {
            cwd: `${__dirname}/..`,
            formatName: 'camelCase'
        })
        .register({
            // Provide previously constructed logger as it is.
            logger: asValue(logger),
            // Inject the database
            db: asValue(db),
            // Inject authenticator
            passport: asValue(passport)
        })
}
