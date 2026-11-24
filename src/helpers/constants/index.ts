import config from '../../config.json' with { type: 'json' };

export const APP_VERSION = config.version;
export const APP_VERSION_URL = config.version.replaceAll('.', '_');

export const URL_VERSION = config.version.replaceAll('.', '-');
// Path prefix of an archived website (e.g. '/15-2'), '' otherwise.
// React Router already adds it to <Link to>, navigate() and useLocation() through `basename`
// (see react-router.config.ts), so never use it there: only for plain <a href> links.
export const BASE_PATH = config.archive ? `/${URL_VERSION}` : '';
