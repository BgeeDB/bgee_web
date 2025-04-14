import {Link} from "react-router";
import Bulma from '../../components/Bulma';
import api from '../../api';
import PATHS from "../../paths/paths";
import config from '../../config.json';
import { getMetadata } from '~/helpers/metadata';
// import { speciesToLdJSON } from "~/helpers/schemaDotOrg";


function getCanonicalURL(sp) {
  return PATHS.SEARCH.GENE_LIST_ITEM_BY_SPECIES
      .replace(':speciesId', sp.id)
      .replace(':speciesName', sp.speciesFullNameWithoutSpace?.replace("_", "-").toLowerCase());
}

export async function loader({ params }) {
  try {
    const [geneListRes, speciesRes] = await Promise.all([
      api.search.species.geneList(params.speciesId),
      api.search.species.name(params.speciesId)
    ]);
    // if (nameResp.data.species.speciesFullNameWithoutSpace !== speciesName) {
    //     navigate(getCanonicalURL(nameResp.data.species), {replace: true});
    // }
    const species = speciesRes.data.species
    const speciesScientificName = `${species.genus} ${species.speciesName}`;
    const speciesDisplay = `${speciesScientificName}${species.name ? ` (${species.name})` : ''}`;
    return {
      genes: geneListRes.data.genes,
      species,
      speciesScientificName,
      speciesDisplay,
    }
  } catch (error) {
    console.warn(error)
    throw new Response(error.data.message || 'Failed to load species data', { status: 404 });
  }
}

export function meta({ data }) {
  const canonicalURL = `${config.genericDomain}${getCanonicalURL(data.species)}`;
  return getMetadata({
    title: `${data.speciesDisplay} gene list`,
    description: `List of genes of ${data.speciesScientificName} with expression data available in Bgee`,
    keywords: `${data.speciesScientificName} genes, gene expression in ${data.speciesScientificName}`,
    link: canonicalURL,
    // schemaorg: [speciesToLdJSON(data)],
  });
}

const SpeciesGeneList = ({ loaderData }) => {
    const { genes, species, speciesDisplay } = loaderData;

    function getGeneDisplay(element) {
        let text = element.geneId;
        if (element.name) {
            text = `${element.name} (${text})`;
        }
        return text;
    }

    return !species ? null :(
        <>
            <div className="content has-text-centered">
                <Bulma.Title size={3} className="m-0">{`Gene list for ${speciesDisplay}`}
                </Bulma.Title>
            </div>
            {genes && (
                <div className="content">
                    <div className="content">
                        <ul className="inline-list">
                            {genes.map((element, index) =>
                                <li key={element.geneId}>
                                    <Link className="internal-link"
                                          to={PATHS.SEARCH.GENE_ITEM_BY_SPECIES
                                              .replace(':geneId', element.geneId)
                                              .replace(':speciesId', element.geneMappedToSameGeneIdCount === 1 ? '' : species?.id)
                                              .replace(/\/$/, '')}
                                          title={`Gene expression for ${element.name} in ${speciesDisplay}`}>
                                        {getGeneDisplay(element)}
                                    </Link>
                                    {index < genes.length - 1 && <span className="inline-list-separator"/>}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default SpeciesGeneList;
