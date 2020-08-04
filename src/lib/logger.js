import {Bristol} from 'bristol'
import palin from 'palin'
import {env} from './env'

export const logger = new Bristol()

/**
 * Utility script that logs relevant development information to the console
 */
if (env.LOG_LEVEL !== 'off') {
    logger.addTarget('console').withFormatter(palin, {
        rootFolderName: 'dr-api' // Edit this to match your actual foldername
    })
}
