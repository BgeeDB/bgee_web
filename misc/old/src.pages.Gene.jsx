import React from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router';

import PATHS from '../../paths/paths';
import api from '../../api';
import GeneDetails from '../../components/Gene/GeneDetails';
import GeneList from '../../components/Gene/GeneList';
import config from '~/config.json';
import { getMetadata } from '~/helpers/metadata';
import { geneHomologsToLdJSON, geneToLdJSON } from '~/helpers/schemaDotOrg';

// Replaced by src/routes/gene.$geneId.tsx

const FLOW = {
  LOADING: 'loading',
  LOADED: 'loaded',
};

export async function loader({ params, request }) {
  try {
    // Get general gene information
    const geneInfoResponse = await api.search.genes.getGeneralInformation(params.geneId);
    const geneDetails = geneInfoResponse.data.genes[0]; // Get the first gene
    if (!geneDetails) throw new Error('Gene not found');

    const { geneId, species } = geneDetails;
    // Get homologs and xrefs in parallel
    const [homologsResult, xRefsResult] = await Promise.allSettled([
      api.search.genes.homologs(geneId, species.id),
      api.search.genes.xrefs(geneId, species.id),
    ]);
    // Process homologs and xrefs data
    let homologs;
    if (homologsResult.status === 'fulfilled') {
      homologs = {
        ...homologsResult.value.data,
        orthologs: 0,
        paralogs: 0,
      };
      homologsResult.value.data.orthologsByTaxon.forEach((o) => {
        if (o.genes.length > homologs.orthologs) homologs.orthologs = o.genes.length;
      });
      homologsResult.value.data.paralogsByTaxon.forEach((o) => {
        if (o.genes.length > homologs.paralogs) homologs.paralogs = o.genes.length;
      });
    }
    let xRefs;
    if (xRefsResult.status === 'fulfilled') {
      xRefs = xRefsResult.value.data;
    }

    return {
      details: geneDetails,
      homologs,
      xRefs,
      pathname: new URL(request.url).pathname,
    };
  } catch (error) {
    console.error('Error loading gene data:', error.data.message);
    throw new Response(error.data.message || 'Failed to load gene data', { status: 404 });
  }
}

export function meta({ data }) {
  if (!data) return getMetadata({});
  const { name, geneId, species, synonyms } = data.details;

  const latinName = `${species.genus} ${species.speciesName}`;
  const speciesName = species.name ? species.name : `${species.genus} ${species.speciesName}`;
  const hasNameOpener = name ? `${name} (` : '';
  const hasNameCloser = name ? `)` : '';
  const speciesNameBrackets = species.name ? ` (${species.name})` : '';
  const nameExpr = name ? `${name}, ${name} expression, ` : '';
  const synonymsExpr = synonyms ? `, ${synonyms.join(', ')}` : '';
  const canonicalLink = `${config.genericDomain}${PATHS.SEARCH.GENE_ITEM_BY_SPECIES.replace(':geneId', geneId)
    .replace(':speciesId', species.id)
    // .replace(':speciesId', geneMappedToSameGeneIdCount === 1 ? '' : species.id)
    .replace(/\/$/, '')}`;

  return getMetadata({
    title: `${name} expression in ${speciesName}`,
    description: `Bgee gene expression data for ${hasNameOpener}${geneId}${hasNameCloser} in ${latinName}${speciesNameBrackets}`,
    keywords: `gene expression, ${nameExpr}${geneId}, ${geneId} expression${synonymsExpr}`,
    link: canonicalLink,
    schemaorg: [
      geneToLdJSON({
        ...data.details,
        xRefs: data.xRefs?.gene?.xRefs,
        path: data.pathname,
      }),
      geneHomologsToLdJSON([...data.homologs.orthologsByTaxon, ...data.homologs.paralogsByTaxon]),
    ],
  });
}

const Gene = () => {
  // const { details, homologs, xRefs } = useLoaderData();
  // const { name, geneId, description, species, synonyms } = details;
  // const loc = useLocation();
  const navigate = useNavigate();
  const { geneId, speciesId: urlSpeciesId } = useParams();

  const [flowState, setFlowState] = React.useState(FLOW.LOADING);
  const [geneDetails, setGeneDetails] = React.useState();

  React.useEffect(() => {
    setFlowState(FLOW.LOADING);
    api.search.genes
      .getGeneralInformation(geneId)
      .then(({ data }) => {
        if (data.genes.length === 1 && urlSpeciesId) {
          navigate(PATHS.SEARCH.GENE_ITEM.replace(':geneId', geneId));
        } else {
          setGeneDetails(data.genes);
          setFlowState(FLOW.LOADED);
        }
      })
      .catch((err) => {
        console.log(err.message);
        navigate(PATHS.ERROR, {
          error: {
            message: err.message || err?.data?.code,
          },
        });
      });
  }, [geneId, urlSpeciesId]);

  if (flowState === FLOW.LOADING) return null;

  if (
    (!urlSpeciesId && geneDetails?.length === 1) ||
    (urlSpeciesId && geneDetails?.length > 1 && geneDetails?.find((g) => g.species.id === urlSpeciesId))
  ) {
    return (
      <GeneDetails
        details={geneDetails.length === 1 ? geneDetails[0] : geneDetails?.find((g) => g.species.id === urlSpeciesId)}
      />
    );
  }

  if (!urlSpeciesId && geneDetails?.length > 1) {
    return <GeneList details={geneDetails} navigate={navigate} />;
  }
  return null;
};

export default Gene;
