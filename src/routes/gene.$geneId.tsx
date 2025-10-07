import api from '~/api';
import GeneDetails from '~/components/Gene/GeneDetails';
import { geneHomologsToLdJSON, geneToLdJSON } from '~/helpers/schemaDotOrg';
import { getMetadata } from '~/helpers/metadata';
import config from '../config.json';

export async function loader({ params, request }) {
  try {
    // Get general gene information
    const startTime = performance.now();
    const geneInfoResponse = await api.search.genes.getGeneralInformation(params.geneId);
    // NOTE: we directly get the first gene
    const geneDetails = geneInfoResponse.data.genes[0];
    console.log(`Got gene details in (${(performance.now() - startTime).toFixed(2)}ms)`);
    if (!geneDetails) throw new Error('Page not found');

    const { geneId, species } = geneDetails;
    // const homologsStartTime = performance.now();
    // Get data in parallel
    // const [homologsResult, xRefsResult, exprResult, notExprResult]: any = await Promise.allSettled([
    const [homologsResult, xRefsResult]: any = await Promise.allSettled([
      api.search.genes.homologs(geneId, species.id),
      api.search.genes.xrefs(geneId, species.id),
      // TODO: adding expression calls here slows down a lot the page loading
      // api.search.genes.expression(geneId, species.id, {}, ['all'], false),
      // api.search.genes.expression(geneId, species.id, {}, ['all'], true),
    ]);
    // console.log(`Got the rest in (${(performance.now() - homologsStartTime).toFixed(2)}ms) Total: ${(performance.now() - startTime).toFixed(2)}ms`);
    // Process homologs data
    const homologs =
      homologsResult.status === 'fulfilled'
        ? {
            ...homologsResult.value.data,
            orthologs: 0,
            paralogs: 0,
          }
        : {};
    homologsResult.value.data.orthologsByTaxon.forEach((o) => {
      if (o.genes.length > homologs.orthologs) homologs.orthologs = o.genes.length;
    });
    homologsResult.value.data.paralogsByTaxon.forEach((o) => {
      if (o.genes.length > homologs.paralogs) homologs.paralogs = o.genes.length;
    });
    // Process xrefs and expression data
    const xRefs = xRefsResult.status === 'fulfilled' ? xRefsResult.value.data : {};
    // const exprData = exprResult.status === 'fulfilled' ? exprResult.value.data : {};
    // const notExprData = notExprResult.status === 'fulfilled' ? notExprResult.value.data : {};
    return {
      details: geneDetails,
      homologs,
      xRefs,
      // exprData,
      // notExprData,
      requestUrl: request.url.replace(/^https?:\/\/.+?\//, `${config.genericDomain}/`),
    };
  } catch (error: any) {
    // console.error('Error loading gene data:', error);
    throw new Response(error.data?.message || error.message || 'Gene not found', { status: 404 });
  }
}

export function meta({ data }) {
  const { name, geneId, species, synonyms } = data.details;
  const latinName = `${species.genus} ${species.speciesName}`;
  const hasNameOpener = name ? `${name} (` : '';
  const hasNameCloser = name ? `)` : '';
  const speciesNameBrackets = species.name ? ` (${species.name})` : '';
  const nameExpr = name ? `${name}, ${name} expression, ` : '';
  const nameExists = name ? `${name} ` : '';
  const synonymsExpr = synonyms ? `, ${synonyms.join(', ')}` : '';

  return getMetadata({
    title: `${nameExists}${geneId} expression in ${latinName}${speciesNameBrackets}`,
    description: `Bgee gene expression data for ${hasNameOpener}${geneId}${hasNameCloser} in ${latinName}${speciesNameBrackets}`,
    keywords: `gene expression, ${nameExpr}${geneId}, ${geneId} expression${synonymsExpr}`,
    link: data.requestUrl,
    schemaorg: [
      geneToLdJSON({
        ...data.details,
        xRefs: data.xRefs?.gene?.xRefs,
        url: data.requestUrl,
      }),
      geneHomologsToLdJSON([...data.homologs.orthologsByTaxon, ...data.homologs.paralogsByTaxon]),
      // TODO: geneExpressionToLdJSON(data.exprData.calls, data.requestUrl),
    ],
  });
}

export default function GenePage({ loaderData }) {
  const { details, homologs, xRefs, exprData } = loaderData;

  return (
    <GeneDetails details={details} homologs={homologs} xRefs={xRefs} exprData={exprData} />
    // notExprData={notExprData}
  );
}
