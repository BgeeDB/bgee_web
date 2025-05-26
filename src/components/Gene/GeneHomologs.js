/* eslint-disable no-nested-ternary,jsx-a11y/label-has-associated-control,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions, no-case-declarations, react/no-array-index-key */
import React from 'react';
import { Link } from 'react-router-dom';
import LinkExternal from '../LinkExternal';
import PATHS from '../../routes/paths';
import Bulma from '../Bulma';
import isPlural from '../../helpers/isPlural';
import {
  MEDIA_QUERIES,
  MEDIA_QUERIES_SIZE,
} from '../../helpers/constants/mediaQueries';
import useWindowSize from '../../hooks/useWindowSize';
import GENE_DETAILS_HTML_IDS from '../../helpers/constants/GeneDetailsHtmlIds';
import Table from '../Table';

const Styles = {
  separator: {
    backgroundColor: 'black',
    height: '1px',
    width: '100%',
  },
};

const TaxonNameCell = ({ id, scientificName }) => (
  <>
    <LinkExternal
      content={id}
      to={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=${id}`}
    >
      <span>{scientificName}</span>
    </LinkExternal>
  </>
);
const ExpressionComparisonCellHomologs = ({ query }) => (
  <Link to={`${PATHS.ANALYSIS.EXPRESSION_COMPARISON}?${query}`} rel="nofollow">
    Compare expression
  </Link>
);
const ExpressionComparisonCellParalogs = ({ query }) => (
  <p>
    <span>Compare expression: </span>
      <Link to={`${PATHS.ANALYSIS.EXPRESSION_COMPARISON}?${query}`} rel="nofollow">
        table
      </Link>
    <span> | </span>
    <Link to={`${PATHS.SEARCH.EXPRESSION_MATRIX}?${query}`} rel="nofollow">
      graph
    </Link>
  </p>
);
const ExpandCell = ({ onClick }) => (
  <a className="expand-button" onClick={onClick}>
    <Bulma.IonIcon name="chevron-down-sharp" />
  </a>
);
const GenesCell = ({ genes }) => {
  const { width } = useWindowSize();
  let prevSpecies = 0;
  const expandContent = genes.reduce((r, a, pos) => {
    r.push(
      <span className="is-size-7" key={a.geneId}>
        {pos !== 0 && a.species.id !== prevSpecies && (
          <div style={Styles.separator} />
        )}
        <Link
          className="internal-link"
          to={PATHS.SEARCH.GENE_ITEM_BY_SPECIES.replace(
            ':geneId',
            a.geneId
          ).replace(
            ':speciesId',
            a.geneMappedToSameGeneIdCount === 1 ? '' : a.species.id
          ).replace(/\/$/, '')}
        >
          {a.geneId}
        </Link>
        {a.name ? ` ${a.name}` : ''}
        {pos < genes.length && <br />}
      </span>
    );
    prevSpecies = a.species.id;

    return r;
  }, []);

  return (
    <div
      style={{
        minWidth:
          width > MEDIA_QUERIES_SIZE[MEDIA_QUERIES.DESKTOP] ? 230 : undefined,
      }}
    >
      <p>{`${genes.length} ${isPlural('gene', genes.length)}`}</p>
      <div className="expand-content">{expandContent}</div>
    </div>
  );
};
const SpeciesCell = ({ genes }) => {
  const { width } = useWindowSize();
  const expandContentSpecies = genes.reduce((r, a) => {
    const pos = r.findIndex((g) => g.id === a.species.id);
    if (pos === -1)
      r.push({
        id: a.species.id,
        scientificName: `${a.species.genus} ${a.species.speciesName}`,
        name: a.species.name,
        nbGenes: 1,
      });
    // eslint-disable-next-line no-param-reassign
    else r[pos].nbGenes += 1;
    return r;
  }, []);

  return (
    <div
      style={{
        minWidth:
          width > MEDIA_QUERIES_SIZE[MEDIA_QUERIES.TABLET] ? 250 : undefined,
      }}
    >
      <p>{`${expandContentSpecies.length} species`}</p>
      <div className="expand-content">
        {expandContentSpecies.map((s, pos) => (
          <span key={s.id} className="is-size-7">
            {pos !== 0 && <div style={Styles.separator} />}
            <Link
              className="internal-link"
              to={PATHS.SEARCH.SPECIES_ITEM.replace(':id', s.id)}
            >
              {s.scientificName}
            </Link>
            {` (${s.name})`}
            {new Array(s.nbGenes).fill(null).map((a, id) => (
              <br key={id} />
            ))}
          </span>
        ))}
      </div>
    </div>
  );
};

const GeneHomologs = ({ homologs, geneId, isLoading }) => {
  const onRenderCell = React.useCallback(
    ({ cell, key }, defaultRender, { expandAction }) => {
      switch (key) {
        case 'taxonName':
          return <TaxonNameCell key={key} {...cell.taxon} />;
        case 'expressionComparisonHomologs':
          return (
            <ExpressionComparisonCellHomologs
              key={key}
              query={cell.storableParams?.queryString}
            />
          );
        case 'expressionComparisonParalogs':
          return (
            <ExpressionComparisonCellParalogs
              key={key}
              query={cell.storableParams?.queryString}
            />
          );
        case 'details':
          return <ExpandCell key={key} onClick={expandAction} />;
        case 'genes':
          return <GenesCell key={key} genes={cell.genes} />;
        case 'species':
          return <SpeciesCell key={key} genes={cell.genes} />;
        default:
          return null;
      }
    },
    [geneId]
  );

  const customHeader = React.useCallback(
    (searchElement, pageSizeElement) => (
      <Bulma.Columns vCentered>
        <Bulma.C size={8}>
          <div className="field">{searchElement}</div>
        </Bulma.C>
        <Bulma.C size={4}>
          <div>{pageSizeElement}</div>
        </Bulma.C>
      </Bulma.Columns>
    ),
    []
  );
  const onFilter = React.useCallback(
    (search) => (element) => {
      const regExp = new RegExp(search, 'i');
      let isFound = regExp.test(element.taxon.scientificName);
      for (let i = 0; !isFound && i < element.genes.length; i += 1) {
        isFound =
          regExp.test(element.genes[i].geneId) ||
          regExp.test(element.genes[i].name) ||
          regExp.test(element.genes[i]?.species.name) ||
          regExp.test(element.genes[i]?.species.genus) ||
          regExp.test(element.genes[i]?.species.speciesName);
      }
      return isFound;
    },
    []
  );

  return (
    <>
      {homologs?.orthologs > 0 && (
        <div>
          <Bulma.Title
            size={4}
            className="gradient-underline"
            id={GENE_DETAILS_HTML_IDS.ORTHOLOGS}
            renderAs="h2"
          >
            Orthologs
          </Bulma.Title>
          <div>
            {isLoading && (
              <progress
                className="progress is-small mt-6"
                max="100"
                style={{ animationDuration: '4s' }}
              >
                80%
              </progress>
            )}
            {!isLoading && homologs?.orthologsByTaxon.length > 0 && (
              <>
                <Table
                  responsive
                  columns={[
                    {
                      key: 'taxonName',
                      text: 'Taxon Name',
                    },
                    {
                      key: 'species',
                      text: 'Species with orthologs',
                      hide: MEDIA_QUERIES.MOBILE_P,
                    },
                    {
                      key: 'genes',
                      text: 'Gene(s)',
                      hide: MEDIA_QUERIES.MOBILE_L,
                    },
                    {
                      key: 'expressionComparisonHomologs',
                      text: 'Expression comparison',
                      hide: MEDIA_QUERIES.DESKTOP_HOMOLOGS,
                    },
                    {
                      key: 'details',
                      text: 'See details',
                      hide: MEDIA_QUERIES.TABLET,
                      style: { width: 55 },
                      noSort: true,
                    },
                  ]}
                  data={homologs?.orthologsByTaxon}
                  onRenderCell={onRenderCell}
                  onFilter={onFilter}
                  customHeader={customHeader}
                />
                {homologs.orthologyXRef && (
                  <span className="is-size-7">
                    {`Orthology information comes from ${homologs.orthologyXRef?.source?.name} : `}
                    <LinkExternal to={homologs.orthologyXRef?.xRefURLWithTags.replace("[gene_id]", homologs.orthologyXRef?.xRefId)}>
                      {homologs.orthologyXRef?.xRefId}
                    </LinkExternal>
                    .
                  </span>
                )}
              </>
            )}
            {!isLoading && homologs?.orthologsByTaxon.length === 0 && (
              <span>No data</span>
            )}
          </div>
        </div>
      )}
      {homologs?.paralogs > 0 && (
        <div>
          <Bulma.Title
            size={4}
            className="gradient-underline"
            id={GENE_DETAILS_HTML_IDS.PARALOGS}
            renderAs="h2"
          >
            Paralogs (same species)
          </Bulma.Title>
          <div>
            {isLoading && (
              <progress
                className="progress is-small mt-6"
                max="100"
                style={{ animationDuration: '4s' }}
              >
                80%
              </progress>
            )}
            {!isLoading && homologs?.paralogsByTaxon.length > 0 && (
              <>
                <Table
                  columns={[
                    {
                      key: 'taxonName',
                      text: 'Taxon Name',
                    },
                    {
                      key: 'genes',
                      text: 'Gene(s)',
                      hide: MEDIA_QUERIES.MOBILE_P,
                    },
                    {
                      key: 'expressionComparisonParalogs',
                      text: 'Expression comparison',
                      hide: MEDIA_QUERIES.MOBILE_L,
                    },
                    {
                      key: 'details',
                      text: 'See details',
                      hide: MEDIA_QUERIES.TABLET,
                      style: { width: 55 },
                      noSort: true,
                    },
                  ]}
                  data={homologs?.paralogsByTaxon}
                  onRenderCell={onRenderCell}
                  onFilter={onFilter}
                  customHeader={customHeader}
                />
                {homologs.paralogyXRef && (
                  <span className="is-size-7">
                    {`Paralogy information comes from ${homologs.paralogyXRef?.source?.name} : `}
                    <LinkExternal to={homologs.paralogyXRef?.xRefURLWithTags.replace("[gene_id]", homologs.paralogyXRef?.xRefId)}>
                      {homologs.paralogyXRef?.xRefId}
                    </LinkExternal>
                    .
                  </span>
                )}
              </>
            )}
            {!isLoading && homologs?.paralogsByTaxon.length === 0 && (
              <span>No data</span>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GeneHomologs;
