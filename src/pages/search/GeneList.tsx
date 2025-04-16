import React from 'react';
import { Link, useLocation } from 'react-router';
import PATHS from '../../paths/paths';
import Bulma from '../../components/Bulma';
import useGeneSearch from '../../hooks/useGeneSearch';
import GeneSearch from '../../components/Gene/GeneSearch';
import splitWithOccurrences from '../../helpers/splitWithOccurrences';
import { MEDIA_QUERIES } from '../../helpers/constants/mediaQueries';
import { customGeneListSorter } from '../../helpers/sortTable';
import Table from '../../components/Table';
import config from '~/config.json';
import { getMetadata } from '~/helpers/metadata';

export function loader({ request }) {
  const searchParams = new URL(request.url).searchParams;
  return { search: searchParams.get('search') };
}

export function meta({ data }) {
  return getMetadata({
    title: `${data.search ? `${data.search} - ` : ''}Gene search`,
    description: data.search ? `${data.search} gene search` : 'Search for a gene in Bgee',
    keywords: `gene search, gene${data.search ? `, ${data.search}` : ''}`,
    link: `${config.genericDomain}${PATHS.SEARCH.GENE}`,
  });
}

const onRenderCell =
  (search) =>
  ({ cell, key, keyRow }, defaultRender) => {
    switch (key) {
      case 'id':
      case 'name':
        return (
          <Link
            key={`${key}-${keyRow}`}
            className="internal-link"
            to={PATHS.SEARCH.GENE_ITEM_BY_SPECIES.replace(':geneId', cell.id)
              .replace(':speciesId', cell.onlySpecies ? '' : cell.speciesId)
              .replace(/\/$/, '')}
          >
            {cell[key]}
          </Link>
        );
      case 'organism':
        return (
          <Link
            key={`${key}-${keyRow}`}
            className="internal-link"
            to={PATHS.SEARCH.SPECIES_ITEM.replace(':id', cell.speciesId)}
          >
            {cell[key]}
          </Link>
        );
      case 'match': {
        const match = splitWithOccurrences(cell.match, search);
        return (
          <span key={`${key}-${keyRow}`}>
            {match.map((v, keyMatch) =>
              typeof v === 'string' ? (
                <React.Fragment key={`${key}-${keyRow}-${keyMatch}`}>{v}</React.Fragment>
              ) : (
                <strong key={`${key}-${keyRow}-${keyMatch}`} className="has-text-primary">
                  {v.text}
                </strong>
              )
            )}{' '}
            ({cell.matchSource})
          </span>
        );
      }
      case 'description':
      default:
        return defaultRender(cell[key]);
    }
  };

const customHeader = (searchElement, pageSizeElement) => (
  <Bulma.Columns vCentered>
    <Bulma.C size={6}>
      <div className="field has-addons">{searchElement}</div>
    </Bulma.C>
    <Bulma.C size={6}>
      <div>{pageSizeElement}</div>
    </Bulma.C>
  </Bulma.Columns>
);

const GeneList = () => {
  const { search: queryParams } = useLocation();
  const [search, setSearch] = React.useState('');
  const { resResultListGenes: results, searchResultHandler, setResults, isLoading } = useGeneSearch();

  const objMapping = React.useCallback(
    (element) => ({
      id: element.gene.geneId,
      gene: element.gene,
      speciesId: element.gene.species.id,
      name: element.gene.name,
      description: element.gene.description,
      organism: `${element.gene.species.genus} ${element.gene.species.speciesName} (${element.gene.species.name})`,
      match: element.match,
      matchSource: element.matchSource,
      onlySpecies: element.gene.geneMappedToSameGeneIdCount === 1,
    }),
    []
  );

  const onFilter = React.useCallback(
    (searchReg) => (element) => {
      const regExp = new RegExp(
        searchReg,
        'i'
      ); /* Needs i = ignoreCase to be able to search with human for Human and human strings */
      return (
        Boolean(regExp.test(element.gene.geneId)) ||
        Boolean(
          regExp.test(
            `${element.gene.species.genus} ${element.gene.species.speciesName} (${element.gene.species.name})`
          )
        ) ||
        Boolean(regExp.test(element.gene.description)) ||
        Boolean(regExp.test(element.gene.name))
      );
    },
    []
  );

  React.useEffect(() => {
    const params = new URLSearchParams(queryParams);

    if (params.get('search')) {
      setSearch(params.get('search') || '');
      setResults(undefined);
      searchResultHandler(params.get('search') || '');
    } else {
      setResults(undefined);
    }
  }, [queryParams, searchResultHandler, setResults]);

  // const meta = React.useMemo(
  //   () => ({
  //     description: results
  //       ? `${search} gene search, ${results.totalMatchCount} results in total`
  //       : 'Search for a gene in Bgee',
  //     keywords: `gene search, gene
  // ${search ? `, ${search}` : ''}`,
  //   }),
  //   [search, results]
  // );

  const count = results.totalMatchCount;

  return (
    <>
      <div className="content has-text-centered">
        <Bulma.Title size={3}>Gene search</Bulma.Title>
      </div>
      <p className="is-size-5 has-text-centered">
        Search for genes based on gene IDs, gene names, gene descriptions, synonyms and cross-references.
      </p>
      <p className="is-size-5 has-text-centered">
        <Link className="internal-link" to={`${PATHS.SUPPORT.TUTORIAL_GENE_PAGE}`}>
          See documentation
        </Link>
      </p>
      <div>
        <GeneSearch classNames="search-input mx-auto my-3" searchTerm={search}>
          <p>
            {`Example: `}
            <Link className="internal-link" to={`${PATHS.SEARCH.GENE}?search=HBB`}>
              HBB
            </Link>
            {', '}
            <Link className="internal-link" to={`${PATHS.SEARCH.GENE}?search=Apoc1`}>
              Apoc1
            </Link>
            {', '}
            <Link className="internal-link" to={`${PATHS.SEARCH.GENE}?search=PDE4DIP`}>
              PDE4DIP
            </Link>
            {', '}
            <Link className="internal-link" to={`${PATHS.SEARCH.GENE}?search=insulin`}>
              insulin
            </Link>
          </p>
        </GeneSearch>
      </div>

      {/* results check added to remove small bug when we do a search, click again on Gene Expression in top bar, and we get `No data`
      It prevents the loading state from doing its job, but the response speed for the Gene search is fast enough it's almost instant */}
      {search && results && (
        <div>
          {typeof count === 'number' && (
            <p className="has-text-centered my-5 has-text-weight-semibold">
              {count > 10000
                ? `About ${count} gene(s) found for '${search}' (only the first 10000 genes are displayed)`
                : `${count} gene(s) found for '${search}'`}
            </p>
          )}
          {isLoading ? (
            <progress className="progress is-small" max="100" style={{ animationDuration: '1.5s' }}>
              80%
            </progress>
          ) : (
            <Table
              pagination
              sortable
              // classNamesTable="is-striped"
              columns={[
                { text: 'Gene ID', key: 'id', hide: MEDIA_QUERIES.MOBILE_P },
                { text: 'Name', key: 'name' },
                {
                  text: 'Description',
                  key: 'description',
                  hide: MEDIA_QUERIES.TABLET,
                },
                {
                  text: 'Organism',
                  key: 'organism',
                  hide: MEDIA_QUERIES.MOBILE_L,
                },
                { text: 'Match', key: 'match', hide: MEDIA_QUERIES.TABLET },
              ]}
              onSortCustom={customGeneListSorter}
              data={results.geneMatches}
              onFilter={onFilter}
              customHeader={customHeader}
              onRenderCell={onRenderCell(search)}
              mappingObj={objMapping}
            />
          )}
        </div>
      )}
    </>
  );
};

export default GeneList;
