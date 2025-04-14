import React from 'react';
import { Link, useLocation } from 'react-router';
import Bulma from '~/components/Bulma';
import PATHS from '~/paths/paths';
import api from '~/api';
import GeneSearch from '~/components/Gene/GeneSearch';
import GeneExpandableList from '~/components/Gene/GeneExpandableList';
import GeneExpressionGraph from '~/components/Gene/GeneExpressionGraph';
import GeneExpressionTable from '~/components/Gene/GeneExpressionTable';
import GeneHomologs from '~/components/Gene/GeneHomologs';
import GeneXRefs from '~/components/Gene/GeneXRefs';
import { geneHomologsToLdJSON, geneToLdJSON } from '~/helpers/schemaDotOrg';
import GENE_DETAILS_HTML_IDS from '~/helpers/constants/GeneDetailsHtmlIds';
import imagePath from '~/helpers/imagePath';
import GeneDetailsSideMenu from '~/components/Gene/GeneDetailsSideMenu';
import { PROC_EXPR_VALUES } from '~/pages/search/rawdata/useLogic';
import config from '~/config.json';
import { getMetadata } from '~/helpers/metadata';

export async function loader({ params, request }) {
  try {
    // Get general gene information
    const geneInfoResponse = await api.search.genes.getGeneralInformation(params.geneId);
    const geneDetails = geneInfoResponse.data.genes[0]; // Get the first gene
    // const geneDetails = undefined;
    if (!geneDetails) throw new Error('Page not found');

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
      pathname: new URL(request.url).pathname
    };
  } catch (error: any) {
    // console.error('Error loading gene data:', error);
    throw new Response(error.data?.message || error.message || 'Failed to load gene data', { status: 404 });
  }
}

export function meta({ data }) {
  if (!data) return getMetadata({});
  const { name, geneId, species, synonyms } = data.details;

  const latinName = `${species.genus} ${species.speciesName}`;
  const speciesName = species.name
    ? species.name
    : `${species.genus} ${species.speciesName}`;
  const hasNameOpener = name ? `${name} (` : '';
  const hasNameCloser = name ? `)` : '';
  const speciesNameBrackets = species.name ? ` (${species.name})` : '';
  const nameExpr = name ? `${name}, ${name} expression, ` : '';
  const synonymsExpr = synonyms ? `, ${synonyms.join(', ')}` : '';
  const canonicalLink = `${config.genericDomain}${PATHS.SEARCH.GENE_ITEM_BY_SPECIES
    .replace(':geneId', geneId)
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
      geneHomologsToLdJSON([...data.homologs.orthologsByTaxon, ...data.homologs.paralogsByTaxon])
    ]
  });
}

const GeneDetails = ({loaderData}) => {
  const { details, homologs, xRefs } = loaderData;
  const { name, geneId, description, species, synonyms } = details;
  const loc = useLocation();

  React.useEffect(() => {
    if (loc.hash) {
      const element = document.getElementById(loc.hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          window.scrollTo({
            top: element.offsetTop,
            behavior: 'smooth',
          });
        }, 2500); // wait for all the elements to load and then scroll. Might need an adjustment
      }
    }
  }, []);

  return (
    <>
      <div id="gene-wrapper">
        <div className="sidebar">
          <div className="side-menu">
            <div className="side-menu-wrapper">
              <GeneDetailsSideMenu homologs={homologs} xRefs={xRefs} />
            </div>
          </div>
        </div>
        <div id="gene-body">
          <div className="is-flex head">
            <GeneSearch />
            <div className="content is-align-items-center is-flex">
              <Bulma.Image
                className="m-0 mr-2 species-img"
                src={imagePath(`/species/${species.id}_light.jpg`)}
                alt={`${species.genus} ${species.speciesName}`}
              />
              <h1 className="title is-size-3 has-text-centered m-0">
                {`Gene : ${name} - ${geneId} - `}
                <i>
                  {species.genus} {species.speciesName}
                </i>
                {species.name ? ` (${species.name})` : ''}
              </h1>
            </div>
          </div>
          <div id={GENE_DETAILS_HTML_IDS.GENERAL_INFORMATION}>
            <Bulma.Title size={4} className="gradient-underline" renderAs="h2">
              General information
            </Bulma.Title>
            <div className="near-columns">
              <Bulma.Columns className="my-0">
                <Bulma.C size={3}>
                  <p className="has-text-weight-semibold">Gene identifier</p>
                </Bulma.C>
                <Bulma.C size={9}>{geneId}</Bulma.C>
              </Bulma.Columns>
              <Bulma.Columns className="my-0">
                <Bulma.C size={3}>
                  <p className="has-text-weight-semibold">Name</p>
                </Bulma.C>
                <Bulma.C size={9}>{name}</Bulma.C>
              </Bulma.Columns>
              <Bulma.Columns className="my-0">
                <Bulma.C size={3}>
                  <p className="has-text-weight-semibold">Description</p>
                </Bulma.C>
                <Bulma.C size={9}>{description}</Bulma.C>
              </Bulma.Columns>
              <Bulma.Columns className="my-0">
                <Bulma.C size={3}>
                  <p className="has-text-weight-semibold">Organism</p>
                </Bulma.C>
                <Bulma.C size={9}>
                  <p>
                    <Link
                      to={PATHS.SEARCH.SPECIES_ITEM.replace(':id', species.id)}
                      className="internal-link"
                    >
                      <i>{`${species.genus} ${species.speciesName}`}</i>
                      {species.name ? ` (${species.name})` : ''}
                    </Link>
                  </p>
                </Bulma.C>
              </Bulma.Columns>
              <Bulma.Columns className="my-0">
                <Bulma.C size={3}>
                  <p className="has-text-weight-semibold">Synonym(s)</p>
                </Bulma.C>
                <Bulma.C size={9}>
                  <GeneExpandableList
                    items={synonyms}
                    renderElement={(ref, key, elements) => (
                      <span key={ref}>
                        {ref}
                        {key !== elements.length - 1 ? (
                          <span className="mr-1">,</span>
                        ) : (
                          ''
                        )}
                      </span>
                    )}
                  />
                </Bulma.C>
              </Bulma.Columns>
              {homologs?.orthologs > 0 && (
                <Bulma.Columns className="my-0">
                  <Bulma.C size={3}>
                    <p className="has-text-weight-semibold">Orthologs</p>
                  </Bulma.C>
                  <Bulma.C size={9}>
                    <p>
                      <a className="internal-link" href="#orthologs">
                        {homologs ? `${homologs.orthologs} orthologs` : ''}
                      </a>
                    </p>
                  </Bulma.C>
                </Bulma.Columns>
              )}
              {homologs?.paralogs > 0 && (
                <Bulma.Columns className="my-0">
                  <Bulma.C size={3}>
                    <p className="has-text-weight-semibold">Paralogs</p>
                  </Bulma.C>
                  <Bulma.C size={9}>
                    <p>
                      <a className="internal-link" href="#paralogs">
                        {homologs ? `${homologs.paralogs} paralogs` : ''}
                      </a>
                    </p>
                  </Bulma.C>
                </Bulma.Columns>
              )}
              <Bulma.Columns className="my-0">
                <Bulma.C size={3}>
                  <p className="has-text-weight-semibold">Source data</p>
                </Bulma.C>
                <Bulma.C size={9}>
                  <Link
                    className="internal-link"
                    to={`${PATHS.SEARCH.RAW_DATA_ANNOTATIONS}?pageType=${PROC_EXPR_VALUES}&species_id=${species.id}&gene_id=${geneId}&cell_type_descendant=true&stage_descendant=true&anat_entity_descendant=true`}
                  >
                    Retrieve all processed expression values for that gene
                  </Link>
                </Bulma.C>
              </Bulma.Columns>
            </div>
          </div>

          <GeneExpressionGraph geneId={geneId} speciesId={species.id} />
          <GeneExpressionTable geneId={geneId} speciesId={species.id} />
          <GeneExpressionTable geneId={geneId} speciesId={species.id} notExpressed />
          <GeneHomologs
            homologs={homologs}
            geneId={geneId}
            isLoading={false}
          />
          {xRefs && <GeneXRefs data={xRefs} isLoading={false} />}
        </div>
      </div>
    </>
  );
};

export default GeneDetails;
