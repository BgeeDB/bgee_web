import config from '../../config.json';

export const APP_VERSION = config.version;
export const APP_VERSION_URL = config.version.replaceAll('.', '_');
