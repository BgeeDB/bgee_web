import React from 'react';
import { Link, useLocation } from 'react-router';

import Bulma from '../Bulma';
import PATHS from '../../paths/paths';
import GeneSearch from './GeneSearch';
import GeneDetailsSideMenu from './GeneDetailsSideMenu';
import GeneExpandableList from './GeneExpandableList';
import GeneExpressionGraph from './GeneExpressionGraph';
import GeneExpressionTable from './GeneExpressionTable';
import GeneHomologs from './GeneHomologs';
import GeneXRefs from './GeneXRefs';
import GENE_DETAILS_HTML_IDS from '../../helpers/constants/GeneDetailsHtmlIds';
import imagePath from '../../helpers/imagePath';
import { PROC_EXPR_VALUES } from '../../pages/search/rawdata/useLogic';
import './GeneDetails.scss';

const GeneDetails = ({
  details: { name, geneId, description, expressionSummary, species, synonyms },
  homologs,
  xRefs,
  exprData = undefined,
  notExprData = undefined,
}) => {
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
        }, 1500); // wait for all the elements to load and then scroll. Might need an adjustment
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
            {expressionSummary?.trim() && <p className="summary has-text-weight-bold">{expressionSummary}</p>}
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
                    <Link to={PATHS.SEARCH.SPECIES_ITEM.replace(':id', species.id)} className="internal-link">
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
                        {key !== elements.length - 1 ? <span className="mr-1">,</span> : ''}
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
          <GeneExpressionTable geneId={geneId} speciesId={species.id} exprData={exprData} />
          <GeneExpressionTable geneId={geneId} speciesId={species.id} exprData={notExprData} notExpressed />
          <GeneHomologs homologs={homologs} geneId={geneId} isLoading={false} />
          {xRefs && <GeneXRefs data={xRefs} isLoading={false} />}
        </div>
      </div>
    </>
  );
};

export default GeneDetails;
