import config from '../config.json';

const obolibraryLinkFromID = (id: string) => `${config.oboLibraryOboPath}${id?.replace(':', '_')}`;

export const obolibraryNCBITaxonLinkFromID = (id: string) => `${config.oboLibraryNCBITaxonPath}${id}`;

export default obolibraryLinkFromID;
