import config from '../../config.json';

export const APP_VERSION = config.version;
export const APP_VERSION_URL = config.version.replaceAll('.', '_');

export const URL_VERSION = config.version.replaceAll('.', '-');
export const URL_ROOT = config.archive ? `/${URL_VERSION}` : '';
