/* eslint-disable jsx-a11y/interactive-supports-focus,react/no-array-index-key,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';
import PATHS from '../../routes/paths';
import useQuery from '../../hooks/useQuery';
import Bulma from '../../components/Bulma';
import api from '../../api';
import CreativeCommons from '../../components/CreativeCommons';
import GridSpecies from '../../components/GridSpecies/GridSpecies';
import classnames from '../../helpers/classnames';
import GaEvent from '../../components/GaEvent/GaEvent';
import ExpressionSearch from '../../components/Search/ExpressionSearch';
import expressionPageHelper from '../../helpers/expressionPageHelper';
import LinkExternal from '../../components/LinkExternal';
import imagePath from '../../helpers/imagePath';

const GeneExpressionCalls = () => {
  const history = useHistory();
  const [singleSpeciesList, setSingleSpeciesList] = React.useState([]);
  const [kwList, setKwList] = React.useState({});
  const [search, setSearch] = React.useState('');
  const filteredSingleSpecies = React.useMemo(() => {
    const tmp = JSON.parse(JSON.stringify(singleSpeciesList));
    if (search === '') return tmp;
    const regExp = new RegExp(search, 'i');
    return tmp.filter(({ id }) =>
      !kwList[id] ? false : Boolean(kwList[id].find((a) => regExp.test(a)))
    );
  }, [singleSpeciesList, search, kwList]);
  const [files, setFiles] = React.useState({});

  const speciesID = useQuery('id');
  React.useEffect(() => {
    api.search.species.exprCalls().then((res) => {
      const sList = res.data.downloadFilesGroups.map((o) => ({
        ...o,
        ...o.members[0],
      }));
      setSingleSpeciesList(sList);
      setKwList(res.data.speciesIdToKeywords);
      const speciesFiles = {};
      sList.forEach((s) => {
        speciesFiles[s.id.toString()] = {
          anatSimple: s.downloadFiles.find(
            (f) =>
              f.category === 'expr_simple' &&
              f.conditionParameters.length === 1 &&
              f.conditionParameters[0] === 'anat_entity'
          ),
          anatAdvanced: s.downloadFiles.find(
            (f) =>
              f.category === 'expr_advanced' &&
              f.conditionParameters.length === 1 &&
              f.conditionParameters[0] === 'anat_entity'
          ),
          fullSimple: s.downloadFiles.find(
            (f) =>
              f.category === 'expr_simple' && f.conditionParameters.length > 1
          ),
          fullAdvanced: s.downloadFiles.find(
            (f) =>
              f.category === 'expr_advanced' && f.conditionParameters.length > 1
          ),
        };
      });
      setFiles(speciesFiles);
    });
  }, []);

  const allSpeciesName = React.useMemo(
    () =>
      singleSpeciesList.map((s) => ` ${s.name} ${s.speciesName}`).join(', '),
    [singleSpeciesList]
  );

  const title = 'Bgee Gene expression calls download page';
  const description = 'Download TSV files containing present/absent gene expression calls from Bgee';
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta property='og:title' content={title} />
        <meta name="description" content={description} />
        <meta property='og:description' content={description} />
        <meta name="keywords" content={`dataset, data download, gene expression calls, present/absent expression calls, ${allSpeciesName}`} />
      </Helmet>
      <div className="content has-text-centered">
        <Bulma.Title size={3}>Gene expression calls</Bulma.Title>
      </div>
      <p className="is-size-5">
        This page provides calls of baseline presence/absence of expression, and
        of differential over-/under-expression, either in single species, or
        made comparable between multiple species. Click on a species or a group
        of species to browse files available for download. It is possible to
        download these data directly into R using our{' '}
        <LinkExternal to="https://bioconductor.org/packages/BgeeDB/">
          R package
        </LinkExternal>
        . See also{' '}
        <Link
          to={PATHS.DOWNLOAD.PROCESSED_EXPRESSION_VALUES}
          className="internal-link"
        >
          processed expression values
        </Link>.
      </p>
      <p className="is-size-5">
        All data are available under the{' '}
        <LinkExternal to="https://creativecommons.org/publicdomain/zero/1.0/">
          Creative Commons Zero license (CC0)
        </LinkExternal>
        .
      </p>
      <Bulma.Card className="form search-input mx-auto my-3">
        <Bulma.Card.Body>
          <div className="content">
            <div className="field">
              <label className="label" htmlFor="search-species">
                Search species
              </label>
              <ExpressionSearch
                search={search}
                setSearch={setSearch}
                elements={expressionPageHelper.autocompleteSpecies(
                  filteredSingleSpecies,
                  kwList,
                  search
                )}
                onRender={expressionPageHelper.autocompleteSpeciesRender(
                  setSearch,
                  history
                )}
              />
            </div>
          </div>
        </Bulma.Card.Body>
      </Bulma.Card>
      <Bulma.Card className="mt-4">
        <Bulma.Card.Header>
          <Bulma.Card.Header.Title className="is-size-4 has-text-primary">
            Single-species{' '}
            <span className="ml-2 has-text-grey is-size-7">
              (click on species to see more details)
            </span>
          </Bulma.Card.Header.Title>
        </Bulma.Card.Header>
        <Bulma.Card.Body>
          <div className="content">
            <div className="grid-species">
              <GridSpecies
                speciesList={filteredSingleSpecies}
                defaultSelection={speciesID}
                onClick={(species, isSelected) => {
                  history.replace(
                    isSelected
                      ? `${PATHS.DOWNLOAD.GENE_EXPRESSION_CALLS}?id=${species.id}`
                      : PATHS.DOWNLOAD.GENE_EXPRESSION_CALLS
                  );
                }}
                onRenderSelection={(species, { onClose }) => (
                  <div
                    className={classnames(
                      'expression-species is-flex is-flex-direction-row p-4'
                    )}
                  >
                    <div className="image-container">
                      <Bulma.Image
                        className="m-0"
                        src={imagePath(`/species/${species.id}_light.jpg`)}
                        alt={`species ${species.genus} ${species.speciesName}- ${species.name}`}
                        fallback="https://via.placeholder.com/260"
                        height={260}
                        width={260}
                      />
                    </div>
                    <div
                      className="is-flex is-flex-direction-column is-justify-content-space-around ml-4"
                      style={{ height: '100%', flex: 1, overflow: 'hidden' }}
                    >
                      <div className="is-flex is-flex-direction-column">
                        <div className="is-flex is-justify-content-flex-end">
                          <Link
                            className="internal-link grey"
                            to={`${PATHS.DOWNLOAD.PROCESSED_EXPRESSION_VALUES}?id=${species.id}`}
                          >
                            See processed expression values
                          </Link>
                          <div className="close" onClick={onClose}>
                            <ion-icon name="close-outline" />
                          </div>
                        </div>
                        <p className="is-size-3">
                          <i>{`${species.genus} ${species.speciesName}`}</i>
                          {species.name ? ` (${species.name})` : ''}
                        </p>
                      </div>
                      <div>
                        <div>
                          <p className="has-text-weight-semibold is-size-5">
                            Presence/Absence of expression
                            <Link
                              className="is-size-6 internal-link ml-2 grey has-text-weight-normal"
                              to={`${PATHS.SUPPORT.TUTORIAL_GENE_EXPR}`}
                            >
                              See documentation
                            </Link>
                          </p>
                          <div>
                            <div>
                              <p className="has-text-weight-semibold mt-3">
                                Anatomical entities only
                              </p>
                              <div className="field has-addons">
                                {files?.[species.id.toString()]?.anatSimple && (
                                  <p className="control">
                                    <GaEvent
                                      category="Gene Expression Calls"
                                      action="download_anat-only_simple-file"
                                      label={
                                        files[species.id.toString()].anatSimple
                                          .path
                                      }
                                    >
                                      <a
                                        className="button"
                                        href={
                                          files[species.id.toString()]
                                            .anatSimple.path
                                        }
                                      >
                                        <ion-icon name="download-outline" />
                                        <span className="is-size-7 ml-2">
                                          Simple file
                                        </span>
                                      </a>
                                    </GaEvent>
                                  </p>
                                )}
                                {files?.[species.id.toString()]
                                  ?.anatAdvanced && (
                                  <p className="control">
                                    <GaEvent
                                      category="Gene Expression Calls"
                                      action="download_anat-only_advanced-file"
                                      label={
                                        files[species.id.toString()]
                                          .anatAdvanced.path
                                      }
                                    >
                                      <a
                                        className="button"
                                        href={
                                          files[species.id.toString()]
                                            .anatAdvanced.path
                                        }
                                      >
                                        <ion-icon name="download-outline" />
                                        <span className="is-size-7 ml-2">
                                          Advanced File
                                        </span>
                                      </a>
                                    </GaEvent>
                                  </p>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="has-text-weight-semibold mt-3">
                                All conditions parameters
                              </p>
                              <div className="field has-addons">
                                {files?.[species.id.toString()]?.fullSimple && (
                                  <p className="control">
                                    <GaEvent
                                      category="Gene Expression Calls"
                                      action="download_all-conditions-parameters_simple-file"
                                      label={
                                        files[species.id.toString()].fullSimple
                                          .path
                                      }
                                    >
                                      <a
                                        className="button"
                                        href={
                                          files[species.id.toString()]
                                            .fullSimple.path
                                        }
                                      >
                                        <ion-icon name="download-outline" />
                                        <span className="is-size-7 ml-2">
                                          Simple file
                                        </span>
                                      </a>
                                    </GaEvent>
                                  </p>
                                )}
                                {files?.[species.id.toString()]
                                  ?.fullAdvanced && (
                                  <p className="control">
                                    <GaEvent
                                      category="Gene Expression Calls"
                                      action="download_all-conditions-parameters_advanced-file"
                                      label={
                                        files[species.id.toString()]
                                          .fullAdvanced.path
                                      }
                                    >
                                      <a
                                        className="button"
                                        href={
                                          files[species.id.toString()]
                                            .fullAdvanced.path
                                        }
                                      >
                                        <ion-icon name="download-outline" />
                                        <span className="is-size-7 ml-2">
                                          Advanced File
                                        </span>
                                      </a>
                                    </GaEvent>
                                  </p>
                                )}
                              </div>
                            </div>
                            <p className=" is-size-7 mt-2">
                              <span className="is-underlined is-italic has-text-weight-semibold">
                                All conditions
                              </span>
                              : combinations anatomy-development-sex-strain
                            </p>
                            <p className=" is-size-7">
                              <span className="is-underlined is-italic has-text-weight-semibold">
                                Advanced file
                              </span>
                              : includes information by data types
                            </p>
                            <p className=" is-size-7">
                              <a
                                href="https://creativecommons.org/publicdomain/zero/1.0/"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Public domain license"
                              >
                                <Bulma.Image
                                  src={imagePath(`/cc-zero.png`)}
                                  alt="Creative Commons Zero license (CC0)"
                                  height={15}
                                  width={80}
                                  style={{ margin: 0, padding: 0, textAlign: 'left' }}
                                />
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        </Bulma.Card.Body>
      </Bulma.Card>
      <Bulma.Card className="mt-4">
        <Bulma.Card.Header>
          <Bulma.Card.Header.Title className="is-size-4 has-text-primary">
            Multi-species{' '}
            <span className="ml-2 has-text-grey is-size-7">
              (orthologous genes in homologous anatomical structures)
            </span>
          </Bulma.Card.Header.Title>
        </Bulma.Card.Header>
        <Bulma.Card.Body>
          <div className="content">
            <p>These files will be available in a future release.</p>
          </div>
        </Bulma.Card.Body>
      </Bulma.Card>
      <Bulma.Columns className="mt-4">
        <Bulma.C size={12}>
          <CreativeCommons />
        </Bulma.C>
      </Bulma.Columns>
    </>
  );
};
export default GeneExpressionCalls;
