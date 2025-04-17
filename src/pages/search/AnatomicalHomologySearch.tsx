import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router';

import Bulma from '../../components/Bulma';
import Table from '../../components/Table';
import api from '../../api';
import PATHS from '../../paths/paths';
import LinkExternal from '../../components/LinkExternal';
import { customAnatomicalHomologySorter } from '../../helpers/sortTable';
import obolibraryLinkFromID from '../../helpers/obolibraryLinkFromID';
import { getMetadata } from '~/helpers/metadata';
import { URL_ROOT } from '~/helpers/constants';

export function meta() {
  return getMetadata({
    title: 'Anatomical homology search',
    description: 'Identify relations of homology and anatomical similarity between anatomical entities.',
    keywords: 'homology, similarity, anatomical entity',
  });
}

const onRenderCell =
  () =>
  ({ cell, key }, defaultRender) => {
    switch (key) {
      case 'ae':
        return cell.anatEntities
          .map((a) => (
            <LinkExternal key={a.id} to={a.link}>
              {a.name}
            </LinkExternal>
          ))
          .reduce(
            (r, a, idx) =>
              idx + 1 === cell.anatEntities.length ? r.concat(a) : r.concat(a, <span key={`ae-${a.id}comma`}>, </span>),
            []
          );
      case 'ss':
        console.log();
        return cell.speciesWithAnatEntityPresence
          .map((a) => (
            <Link className="internal-link" key={a.id} to={a.link}>
              {a.name}
            </Link>
          ))
          .reduce(
            (r, a, idx) =>
              idx + 1 === cell.speciesWithAnatEntityPresence.length
                ? r.concat(a)
                : r.concat(a, <span key={`ss-${idx}-comma`}>, </span>),
            []
          );
      case 'at':
        return defaultRender(cell.ancestralTaxon, key);
      default:
        return null;
    }
  };

const customHeader = (searchElement, pageSizeElement) => (
  <Bulma.Columns>
    <Bulma.C size={6}>
      <div className="field has-addons">{searchElement}</div>
    </Bulma.C>
    <Bulma.C size={6}>
      <div>{pageSizeElement}</div>
    </Bulma.C>
  </Bulma.Columns>
);

const onFilter = (search) => (element) => {
  const regExp = new RegExp(search);
  let matchFilter = regExp.test(element?.ancestralTaxon);
  if (!matchFilter) {
    for (let i = 0; i < element.anatEntities.length; i += 1) {
      matchFilter = regExp.test(element?.anatEntities[i].name);
      if (matchFilter) break;
    }
  }
  if (!matchFilter) {
    for (let i = 0; i < element.speciesWithAnatEntityPresence.length; i += 1) {
      matchFilter = regExp.test(element?.speciesWithAnatEntityPresence[i].name);
      if (matchFilter) break;
    }
  }
  return matchFilter;
};
const DEFAULT_RESULTS = {
  signature: undefined,
  data: undefined,
};

const AnatomicalHomologySearch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [anatomicalEntities, setAnatomicalEntities] = React.useState('');
  const [error, setError] = React.useState('');
  const [selectedSpecies, setSelectedSpecies]: any = React.useState([]);
  const { search: searchParams, pathname } = useLocation();
  const [results, set]: any = React.useState(DEFAULT_RESULTS);
  const [speciesList, setSpeciesList]: any = React.useState([]);

  const onToggleSpecies = React.useCallback(
    (speciesId: string) => () => {
      setSelectedSpecies((prev) => {
        let curr = [...prev];
        if (speciesId !== 'ALL') {
          const pos = curr.findIndex((c) => c === speciesId);
          if (pos >= 0) {
            curr.splice(pos, 1);
          } else {
            curr.push(speciesId);
          }
        } else if (curr.length !== speciesList.length) {
          curr = speciesList.map((s) => s.id);
        } else {
          curr = [];
        }
        return curr;
      });
    },
    [speciesList]
  );
  const setResults = React.useCallback(
    (d) => {
      set(d || DEFAULT_RESULTS);
    },
    [anatomicalEntities]
  );

  const onSubmit = React.useCallback(() => {
    if (selectedSpecies.length < 2) {
      setError('species');
      return;
    }
    if (anatomicalEntities === '') {
      setError('ae');
      return;
    }
    setError('');

    setLoading(true);
    api.search
      .anatomicalHomology(
        {
          type: 'form',
        },
        selectedSpecies,
        anatomicalEntities
      )
      .then(({ data, storableParams: { queryString } }: any) => {
        setResults({
          signature: queryString,
          data,
        });
        navigate(`${URL_ROOT}${pathname}?${queryString}`);
      })
      .catch((err) => {
        console.error(err);
        setResults(undefined);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [anatomicalEntities, selectedSpecies]);

  React.useEffect(() => {
    if (searchParams && searchParams.replace('?', '') !== results?.signature) {
      setLoading(true);
      api.search
        .anatomicalHomology({
          type: 'query',
          query: searchParams,
        })
        .then(({ data, storableParams: { queryString }, requestParameters }: any) => {
          setResults({
            signature: queryString,
            data,
          });
          setSelectedSpecies(requestParameters?.species_list.map((s) => parseInt(s, 10)));
          setAnatomicalEntities(requestParameters?.ae_list.join('\n'));
        })
        .catch((err) => {
          console.error(err);
          setResults({
            ...DEFAULT_RESULTS,
            signature: searchParams.replace('?', ''),
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [searchParams, results]);
  React.useEffect(() => {
    api.search.species.list().then((r) => {
      setSpeciesList(
        r.data.species
          .sort((a, b) => a.preferredDisplayOrder - b.preferredDisplayOrder)
          .map(({ id, genus, speciesName }) => ({
            id,
            name: `${genus} ${speciesName}`,
          }))
      );
    });
  }, []);

  return (
    <>
      <div className="content has-text-centered">
        <Bulma.Title size={3}>Anatomical homology</Bulma.Title>
      </div>
      <p className="has-text-centered">
        Retrieve anatomical homologies from a list of species and a list of Uberon IDs. Retrieve Uberon IDs from organ
        names{' '}
        <a
          href="https://www.ebi.ac.uk/ols/ontologies/uberon"
          className="external-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        .
      </p>
      <p className="has-text-centered">
        <Link className="internal-link" to={`${PATHS.SUPPORT.TUTORIAL_ANAT_HOMOLOGY}`}>
          See documentation
        </Link>
      </p>
      <div>
        {!(loading && anatomicalEntities === '') && (
          <Bulma.Card className="form mx-auto my-3" style={{ maxWidth: 750 }}>
            <Bulma.Card.Body>
              <div className="content">
                <div className="field is-flex is-justify-content-space-between">
                  <div>
                    <label className="label" htmlFor="search-species">
                      Anatomical entities
                    </label>
                    <div className="control" style={{ maxWidth: 250 }}>
                      <textarea
                        className="textarea has-fixed-size"
                        name="search-species"
                        rows={10}
                        value={anatomicalEntities}
                        onChange={(e) => setAnatomicalEntities(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="search-species">
                      Species to define least common ancestor
                    </label>
                    <div className="control checkboxes">
                      <label className="checkbox is-size-7 p-1" htmlFor="checkbox-ALL">
                        <input
                          id="checkbox-ALL"
                          type="checkbox"
                          className="mr-2"
                          name="ALL"
                          checked={speciesList.length === selectedSpecies.length}
                          onChange={onToggleSpecies('ALL')}
                        />
                        Select All
                      </label>
                      {speciesList?.map(({ id, name }) => (
                        <label className="checkbox is-size-7 p-1" key={id} htmlFor={`checkbox-${id}`}>
                          <input
                            id={`checkbox-${id}`}
                            type="checkbox"
                            className="mr-2"
                            name={id}
                            checked={selectedSpecies.includes(id)}
                            onChange={onToggleSpecies(id)}
                          />
                          <i>{name}</i>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <div className="is-flex is-align-items-center">
                      <button
                        className="button mr-2 search-form px-6"
                        type="button"
                        disabled={loading}
                        onClick={onSubmit}
                      >
                        Search
                      </button>
                      {error && (
                        <span className="has-text-primary has-text-weight-semibold">
                          {error === 'species' && 'You must select at least two species.'}
                          {error === 'ae' && 'You must enter least one Uberon ID.'}
                        </span>
                      )}
                    </div>
                    <p className="mt-2">
                      {`Example: `}
                      <Link
                        className="internal-link"
                        to={`${URL_ROOT}${pathname}?species_list=9606&species_list=7955&ae_list=UBERON%3A0002048`}
                      >
                        Lung in human and zebrafish
                      </Link>
                      {', '}
                      <Link
                        className="internal-link"
                        to={`${URL_ROOT}${pathname}?species_list=9606&species_list=7955&ae_list=UBERON%3A0000206`}
                      >
                        Pharyngeal gill in human and zebrafish
                      </Link>
                      {', '}
                      <Link
                        className="internal-link"
                        to={`${URL_ROOT}${pathname}?species_list=9606&species_list=7955&ae_list=CL%3A0000084`}
                      >
                        T Cell in human and zebrafish
                      </Link>
                      {', Placenta '}
                      <Link
                        className="internal-link"
                        to={`${URL_ROOT}${pathname}?species_list=9606&species_list=9598&ae_list=UBERON%3A0001987`}
                      >
                        in human and chimpanzee
                      </Link>
                      {' (homologous structure), or '}
                      <Link
                        className="internal-link"
                        to={`${URL_ROOT}${pathname}?species_list=9606&species_list=7955&ae_list=UBERON%3A0001987`}
                      >
                        in human and zebrafish
                      </Link>
                      {' (no homologous structure)'}
                    </p>
                  </div>
                </div>
              </div>
            </Bulma.Card.Body>
          </Bulma.Card>
        )}
      </div>
      {loading && (
        <Bulma.Notification color="info" className="mt-5">
          <p className="has-text-centered">Loading</p>
          <progress className="progress is-small" max="100" style={{ animationDuration: '3s', marginBottom: 12 }}>
            80%
          </progress>
        </Bulma.Notification>
      )}
      {!loading && results.signature && (
        <div>
          <Bulma.Title size={5} className="gradient-underline">
            Results
          </Bulma.Title>
          <p className="my-5">
            Least common ancestor of provided species: {results.data.leastCommonAncestor.scientificName}
          </p>
          <Table
            pagination
            sortable
            multiSortable
            onSortCustom={customAnatomicalHomologySorter}
            onFilter={onFilter}
            // classNamesTable="is-striped"
            columns={[
              {
                text: 'Anatomical entities',
                key: 'ae',
              },
              {
                text: 'Ancestral taxon',
                key: 'at',
              },
              {
                text: 'Presence among selected species',
                key: 'ss',
              },
            ]}
            data={results?.data?.anatEntitySimilarities || []}
            customHeader={customHeader}
            onRenderCell={onRenderCell()}
          />
          {results.data.unrecognizedAnatEntityIds?.length > 0 && (
            <p className="mt-2">
              Anatomical entities IDs unknown:{' '}
              {results.data.unrecognizedAnatEntityIds.map((ann, key) => (
                <span key={ann}>
                  {`'${ann}'${key + 1 !== results.data.anatEntitesWithNoSimilarityAnnotation.length ? ', ' : ''}`}
                </span>
              ))}
            </p>
          )}
          {results.data.anatEntitesWithNoSimilarityAnnotation?.length > 0 && (
            <p className="mt-2">
              Anatomical entities without anatomical homology:{' '}
              {results.data.anatEntitesWithNoSimilarityAnnotation.map((ann, key) => (
                <React.Fragment key={ann.id}>
                  <LinkExternal to={obolibraryLinkFromID(ann.id)}>{`${ann.name} (${ann.id})`}</LinkExternal>
                  {key + 1 !== results.data.anatEntitesWithNoSimilarityAnnotation.length && ', '}
                </React.Fragment>
              ))}
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default AnatomicalHomologySearch;
