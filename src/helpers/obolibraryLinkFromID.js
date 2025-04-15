import config from '../config.json';

const obolibraryLinkFromID = (id) => `${config.oboLibraryOboPath}${id?.replace(':', '_')}`;

export const obolibraryNCBITaxonLinkFromID = (id) => `${config.oboLibraryNCBITaxonPath}${id}`;

export default obolibraryLinkFromID;
