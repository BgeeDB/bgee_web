/* eslint-disable no-nested-ternary,jsx-a11y/label-has-associated-control,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions, no-case-declarations, react/no-array-index-key */
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import Bulma from '../Bulma';
import api from '../../api';
import classnames from '../../helpers/classnames';
import LinkExternal from '../LinkExternal';
import useQuery from '../../hooks/useQuery';
import schemaDotOrg from '../../helpers/schemaDotOrg';
import { MEDIA_QUERIES } from '../../helpers/constants/mediaQueries';
import GENE_DETAILS_HTML_IDS from '../../helpers/constants/GeneDetailsHtmlIds';
import Table from '../Table';
import obolibraryLinkFromID from '../../helpers/obolibraryLinkFromID';
import PATHS from '../../routes/paths';
import {
  FULL_LENGTH_LABEL,
  SOURCE_LETTER_FULL_LENGTH,
} from '../../api/prod/constant';
import {
  AFFYMETRIX,
  ALL_DATA_TYPES,
  EST,
  ID_FULL_LENGTH,
  IN_SITU,
  RNA_SEQ,
  PROC_EXPR_VALUES,
} from '../../pages/search/rawdata/useLogic';
import TagSource from '../TagSource/TagSource';
import config from '../../config.json';

const APP_VERSION = config.version;
const URL_VERSION = APP_VERSION.replaceAll('.', '-');
const URL_ROOT = `${config.archive ? `/${URL_VERSION}` : ''}`;
const DATA_TYPES = [
  {
    key: 'AFFYMETRIX',
    text: 'Affymetrix',
  },
  {
    key: 'EST',
    text: 'EST',
  },
  {
    key: 'IN_SITU',
    text: 'In Situ',
  },
  {
    key: 'RNA_SEQ',
    text: 'RNA Seq',
  },
  {
    key: ID_FULL_LENGTH,
    text: FULL_LENGTH_LABEL,
  },
];
const CUSTOM_FIELDS = [
  {
    key: 'anat',
    text: 'Anat. entity and cell types',
  },
  {
    key: 'devStage',
    text: 'Dev. stage',
  },
  {
    key: 'sex',
    text: 'Sex',
  },
  {
    key: 'strain',
    text: 'Strain',
  },
];

const columnsGenerator = (cFields, data) => () => {
  let c = [];
  if (!data) return null;

  if (data.requestedConditionParameters.find((r) => r === 'Anat. entity')) {
    c.push({
      key: 'anatEntity',
      text: 'Anatomical entity',
    });
  }
  if (data.requestedConditionParameters.find((r) => r === 'Dev. stage'))
    c.push({
      key: 'devStage',
      text: 'Dev. stage',
      hide: MEDIA_QUERIES.DESKTOP,
    });
  if (data.requestedConditionParameters.find((r) => r === 'Sex'))
    c.push({
      key: 'sex',
      text: 'Sex',
      hide: MEDIA_QUERIES.DESKTOP,
    });
  if (data.requestedConditionParameters.find((r) => r === 'Strain'))
    c.push({
      key: 'strain',
      text: 'Strain',
      style: { width: 100 },
      hide: MEDIA_QUERIES.DESKTOP,
    });
  c = [
    ...c,
    {
      key: 'expScore',
      text: 'Expression score',
      hide: MEDIA_QUERIES.MOBILE_L,
    },
    {
      key: 'fdr',
      text: 'FDR',
      style: { width: 100 },
      hide: MEDIA_QUERIES.MOBILE_L,
    },
    {
      key: 'proc_expr_values',
      text: 'Link to source data',
      hide: MEDIA_QUERIES.MOBILE_L,
    },
    {
      key: 'sources',
      text: 'Sources',
      style: {
        width: 110,
      },
      hide: MEDIA_QUERIES.DESKTOP,
    },
  ];
  return c;
};
const AnatEntityCell = ({ cell }) => {
  const cellInfo = [];

  if (cell.condition.cellType) {
    cellInfo.push(
      <LinkExternal
      key={`link-${cell.condition.cellType.id}`}
      to={obolibraryLinkFromID(cell.condition.cellType.id)}
      className="mr-1"
      >
        {cell.condition.cellType.id}
      </LinkExternal>
    );
    cellInfo.push(<i key="link-in"> in </i>);
  }

  cellInfo.push(
    <LinkExternal
      key={`link-${cell.condition.anatEntity.id}`}
      to={obolibraryLinkFromID(cell.condition.anatEntity.id)}
      className="mr-1"
    >
      {cell.condition.anatEntity.id}
    </LinkExternal>,
  );

  if (cell.condition.cellType) {
    cellInfo.push(
      <span key={`name-${cell.condition.cellType.name}`}>
        {cell.condition.cellType.name}
      </span>
    );
    cellInfo.push(<i key="name-in"> in </i>);
  }
  cellInfo.push(
    <span key={`name-${cell.condition.anatEntity.name}`}>
      {cell.condition.anatEntity.name}
    </span>
  );
  return <>{cellInfo}</>;
};

// PAss to true if you want the two table to be handled separately in the url
const SEPARATE_DATA_FORM = false;

const GeneExpressionTable = ({ geneId, speciesId, notExpressed }) => {
  const exprKey = React.useMemo(
    () =>
      notExpressed && SEPARATE_DATA_FORM ? 'not_expression' : 'expression',
    [notExpressed]
  );
  const dataTypeKey = React.useMemo(
    () => (notExpressed && SEPARATE_DATA_FORM ? 'not_data_type' : 'data_type'),
    [notExpressed]
  );
  const history = useHistory();
  const hashExpr = useQuery(exprKey);
  const dataTypeExpr = useQuery(dataTypeKey);
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState();
  const [cFields, setCFields] = React.useState({ anat: true });
  const [dataType, setDataTypes] = React.useState(DATA_TYPES.map((d) => d.key));

  const columns = React.useMemo(columnsGenerator(cFields, data), [
    cFields,
    data,
  ]);

  // In order to disable the search button in the search has already been made
  const formSearchButtonIsDisabled = React.useMemo(() => {
    const oldQuery = Object.entries(cFields)
      .reduce((acc, [key, value]) => (value ? [...acc, key] : acc), [])
      .sort()
      .join(',');

    const oldDataType = (
      dataTypeExpr?.split(',') || DATA_TYPES.map((d) => d.key)
    ).sort();

    return (
      oldQuery === (hashExpr || 'anat') &&
      JSON.stringify(dataType.sort()) === JSON.stringify(oldDataType)
    );
  }, [cFields, hashExpr, dataType, dataTypeExpr]);

  const customHeader = React.useCallback(
    (searchElement, pageSizeElement) => (
      <>
        <div className="is-flex is-flex-wrap-wrap gene-expr-fields-wrapper">
          {CUSTOM_FIELDS.map((c) => (
            <label
              className="checkbox ml-2 is-size-7 is-flex is-align-items-center"
              key={c.key}
            >
              <input
                type="checkbox"
                checked={cFields[c.key] || false}
                onChange={(e) => {
                  setCFields((prev) => ({
                    ...prev,
                    [c.key]: e.target.checked || undefined,
                  }));
                }}
              />
              <b className="mx-1">{c.text}</b>
            </label>
          ))}
          <Bulma.Button
            className="search-form"
            disabled={
              JSON.stringify(Object.keys(cFields).sort()) ===
              JSON.stringify(CUSTOM_FIELDS.map((d) => d.key).sort())
            }
            onClick={() => {
              const obj = {};
              CUSTOM_FIELDS.forEach((c) => {
                obj[c.key] = true;
              });
              setCFields(obj);
            }}
          >
            Select All
          </Bulma.Button>
          <Bulma.Button
            className="search-form"
            disabled={Object.keys(cFields).length === 0}
            onClick={() => setCFields({})}
          >
            Unselect All
          </Bulma.Button>
        </div>
        <div className="is-flex is-flex-wrap-wrap gene-expr-fields-wrapper mt-2">
          {DATA_TYPES.map((c) => (
            <label
              className="checkbox ml-2 is-size-7 is-flex is-align-items-center"
              key={c.key}
            >
              <input
                type="checkbox"
                checked={dataType.find((d) => d === c.key) || false}
                onChange={(e) => {
                  setDataTypes((prev) => {
                    const curr = [...prev];
                    if (e.target.checked) {
                      curr.push(c.key);
                    } else {
                      const pos = curr.findIndex((d) => d === c.key);
                      if (pos >= 0) curr.splice(pos, 1);
                    }
                    return curr;
                  });
                }}
              />
              <b className="mx-1">{c.text}</b>
            </label>
          ))}
          <Bulma.Button
            className="search-form"
            disabled={
              JSON.stringify(dataType.sort()) ===
              JSON.stringify(DATA_TYPES.map((d) => d.key).sort())
            }
            onClick={() => setDataTypes(DATA_TYPES.map((d) => d.key))}
          >
            Select All
          </Bulma.Button>
          <Bulma.Button
            className="search-form"
            disabled={dataType.length === 0}
            onClick={() => setDataTypes([])}
          >
            Unselect All
          </Bulma.Button>
        </div>
        <div className="is-flex is-flex-wrap-wrap gene-expr-fields-wrapper mt-2">
          <Bulma.Button
            className="search-form"
            disabled={formSearchButtonIsDisabled}
            onClick={() => {
              const queryParams = new URLSearchParams(window.location.search);
              queryParams.set(
                exprKey,
                Object.entries(cFields)
                  .reduce(
                    (acc, [key, value]) => (value ? [...acc, key] : acc),
                    []
                  )
                  .join(',')
              );
              if (
                JSON.stringify(dataType.sort()) !==
                  JSON.stringify(DATA_TYPES.map((d) => d.key).sort()) &&
                dataType.length > 0
              )
                queryParams.set(dataTypeKey, dataType.join(','));
              else queryParams.delete(dataTypeKey);

              history.replace(`${URL_ROOT}${history.location.pathname}?${queryParams.toString()}`);
            }}
          >
            Update
          </Bulma.Button>
        </div>
        <Bulma.Columns vCentered className="mt-0">
          <Bulma.C size={8}>
            <div className="field">{searchElement}</div>
          </Bulma.C>
          <Bulma.C size={4}>
            <div>{pageSizeElement}</div>
          </Bulma.C>
        </Bulma.Columns>
      </>
    ),
    [isLoading, cFields, dataType]
  );
  const onRenderCell = React.useCallback(
    ({ cell, key }, defaultRender) => {
      switch (key) {
        case 'anatEntity':
          return <AnatEntityCell cell={cell} />;
        case 'devStage':
          return (
            <>
              <span className="is-size-7">
                <LinkExternal
                  to={obolibraryLinkFromID(cell.condition.devStage.id)}
                  className="mr-1"
                >
                  {cell.condition.devStage.id}
                </LinkExternal>
                {cell.condition.devStage.name}
              </span>
            </>
          );
        case 'expScore':
          return (
            <span
              key={key}
              style={
                cell.expressionScore.expressionScoreConfidence !== 'high'
                  ? {
                      color: 'lightgrey',
                    }
                  : {}
              }
            >
              {cell.expressionScore.expressionScore}
            </span>
          );
        case 'fdr':
          return defaultRender(cell.fdr, key);
        case 'proc_expr_values':
          let searchParams = `pageType=${PROC_EXPR_VALUES}&gene_id=${geneId}&species_id=${speciesId}&cell_type_descendant=true&stage_descendant=true&anat_entity_descendant=true&only_propagated=true`;
          if (
            data.requestedConditionParameters.find((r) => r === 'Anat. entity')
          ) {
            searchParams += `&anat_entity_id=${cell?.condition?.anatEntity?.id}`;
          }
          if (
            data.requestedConditionParameters.find((r) => r === 'Dev. stage')
          ) {
            searchParams += `&stage_id=${cell?.condition?.devStage?.id}`;
          }

          if (data.requestedConditionParameters.find((r) => r === 'Sex')) {
            searchParams += `&sex=${cell?.condition?.sex}`;
          }
          if (data.requestedConditionParameters.find((r) => r === 'Strain')) {
            searchParams += `&strain=${cell?.condition?.strain}`;
          }
          if (data.requestedConditionParameters.find((r) => r === 'Cell type')) {
            // cellType can sometimes be undefined
            if (cell?.condition?.cellType?.id) {
              searchParams += `&cell_type_id=${cell?.condition?.cellType?.id}`;
            }
          }
          return (
            <Link to={`${PATHS.SEARCH.RAW_DATA_ANNOTATIONS}?${searchParams}`}>
              See source data
            </Link>
          );
        case 'strain':
          return defaultRender(cell.condition.strain, key);
        case 'sex':
          return defaultRender(cell.condition.sex, key);
        case 'sources':
          const col = columns.find((c) => c.key === key);
          const source = {};
          ALL_DATA_TYPES.forEach((dt) => {
            source[dt.id] = false;
          });
          cell.dataTypesWithData.forEach((dataTypeString) => {
            switch (dataTypeString) {
              case 'Affymetrix':
                source[AFFYMETRIX] = true;
                break;
              case 'EST':
                source[EST] = true;
                break;
              case 'in situ hybridization':
                source[IN_SITU] = true;
                break;
              case 'RNA-Seq':
                source[RNA_SEQ] = true;
                break;
              case 'single-cell RNA-Seq':
                source[ID_FULL_LENGTH] = true;
                break;
              case 'full length single cell RNA-Seq': // @Don't change Full-length
                source[ID_FULL_LENGTH] = true;
                break;
              default:
                break;
            }
          });
          return (
            <div className="tags tags-source" style={col?.style}>
              <TagSource source={source} />
            </div>
          );
        default:
          return defaultRender(cell?.[key] || key, key);
      }
    },
    [columns]
  );
  const onFilter = React.useCallback(
    (search) => (element) => {
      const regExp = new RegExp(search, 'i');
      return (
        regExp.test(element?.condition?.anatEntity?.id) ||
        regExp.test(element?.condition?.anatEntity?.name) ||
        regExp.test(element?.condition?.devStage?.id) ||
        regExp.test(element?.condition?.devStage?.name) ||
        regExp.test(element?.condition?.cellType?.id) ||
        regExp.test(element?.condition?.cellType?.name) ||
        regExp.test(element?.condition?.strain) ||
        regExp.test(element?.condition?.sex)
      );
    },
    []
  );

  React.useEffect(() => {
    setIsLoading(true);
    const fields = {};
    if (hashExpr) {
      hashExpr.split(',').forEach((key) => {
        fields[key] = true;
      });
    } else fields.anat = true;
    setCFields(fields);

    let dt;
    if (dataTypeExpr) {
      dt = dataTypeExpr.split(',');
    } else dt = DATA_TYPES.map((d) => d.key);
    setDataTypes(dt);

    api.search.genes
      .expression(
        geneId,
        speciesId,
        fields,
        !dataTypeExpr ? ['all'] : dt,
        notExpressed
      )
      .then((res) => {
        setData(res.data);
        if (
          res.data.requestedConditionParameters.find(
            (r) => r === 'Anat. entity'
          )
        )
          if (!notExpressed) schemaDotOrg.setGeneExpressionLdJSON(res.data);
      })
      .catch((err) => {
        console.error(err);
        setData();
      })
      .finally(() => setIsLoading(false));

    return () => {
      if (!notExpressed) schemaDotOrg.unsetGeneExpressionLdJSON();
    };
  }, [hashExpr, dataTypeExpr]);

  return (
    <>
      <Bulma.Title
        size={4}
        className="gradient-underline"
        id={
          notExpressed
            ? GENE_DETAILS_HTML_IDS.EXPRESSION_ABSENT_TABLE
            : GENE_DETAILS_HTML_IDS.EXPRESSION_TABLE
        }
        renderAs="h2"
      >
        {notExpressed ? 'Reported absence of expression' : 'Expression table'}
      </Bulma.Title>
      <div>
        {isLoading && (
          <progress
            className="progress is-small"
            max="100"
            style={{ animationDuration: '4s' }}
          >
            80%
          </progress>
        )}
        {!isLoading && data && (
          <>
            <Table
              identifierAtFilter
              columns={columns}
              data={data.calls}
              emptyTableMessage={
                <span>
                  {notExpressed
                    ? 'No reported absence of expression for this gene'
                    : 'No expression for this gene'}
                </span>
              }
              onRenderCell={onRenderCell}
              pagination
              name="GeneExpression"
              onFilter={onFilter}
              customHeader={customHeader}
              onRenderRow={(row, prev) => {
                if (prev && row.clusterIndex > prev.clusterIndex) {
                  return 'gene-expr-row gap-cluster';
                }
                return 'gene-expr-row';
              }}
            />
            {data.calls.length > 0 && (
              <>
                <p className="has-text-weight-semibold is-underlined mt-0">
                  Sources
                </p>
                <Bulma.Columns vCentered className="my-0">
                  <Bulma.C>
                    <span>
                      <b>A</b>
                      <span className="is-size-7"> Affimetrix</span>
                    </span>
                  </Bulma.C>
                  <Bulma.C>
                    <span>
                      <b>E</b>
                      <span className="is-size-7"> EST</span>
                    </span>
                  </Bulma.C>
                  <Bulma.C>
                    <span>
                      <b>I</b>
                      <span className="is-size-7"> In Situ</span>
                    </span>
                  </Bulma.C>
                  <Bulma.C>
                    <span>
                      <b>R</b>
                      <span className="is-size-7"> RNA-Seq</span>
                    </span>
                  </Bulma.C>
                  <Bulma.C>
                    <span>
                      <b>{SOURCE_LETTER_FULL_LENGTH}</b>
                      <span className="is-size-7"> {FULL_LENGTH_LABEL}</span>
                    </span>
                  </Bulma.C>
                  <Bulma.C className="is-flex is-align-items-center">
                    <span
                      className={classnames('tag tag-source present legend', {
                        'is-primary': true,
                      })}
                    >
                      data
                    </span>
                    <span
                      className={classnames('ml-1 tag tag-source legend', {
                        'is-primary': false,
                      })}
                    >
                      no data
                    </span>
                  </Bulma.C>
                </Bulma.Columns>
                <p className="has-text-weight-semibold is-underlined mt-0">
                  Expression scores
                </p>
                <Bulma.Columns vCentered className="mt-0">
                  <Bulma.C>
                    <span>
                      <span style={{ color: 'lightGrey' }}>3.25e4</span>
                      <span className="is-size-7">
                        {' '}
                        lightgrey: low confidence scores
                      </span>
                    </span>
                  </Bulma.C>
                  <Bulma.C className="is-flex is-align-items-center">
                    <hr className="dot-line m-0 mr-2" />
                    <span className="is-size-7">
                      {' '}
                      important score variation
                    </span>
                  </Bulma.C>
                </Bulma.Columns>
                <div className="separator my-5" />
                <p className="is-size-7">
                  <b>Expression scores</b> of expression calls is based on the
                  rank of a gene in a condition according to its expression
                  levels (non-parametric statistics), normalized using the
                  minimum and maximum Rank of the species. Values of Expression
                  scores are between 0 and 100. Low score means that the gene is
                  lowly expressed in the condition compared to other genes.
                  Scores are normalized and comparable across genes, conditions
                  and species.
                </p>
              </>
            )}
            {data?.gene?.species && (
              <Bulma.Columns>
                <Bulma.Column size={4}>
                  <p className="is-size-7">
                    Sources of annotations to anatomy and development:
                  </p>
                  <ul className="unordered">
                    {!!data?.gene?.species &&
                      data.gene.species.sourcesOfAnnotationsPerDataType.map(
                        (d, key) => (
                          <li key={key} className="is-size-7">
                            {`${d.dataType} data: `}
                            {d.sources.map((s, sKey) => (
                              <LinkExternal key={sKey} to={s.baseUrl}>
                                {s.name}
                              </LinkExternal>
                            ))}
                          </li>
                        )
                      )}
                  </ul>
                </Bulma.Column>
                <Bulma.Column size={4}>
                  <p className="is-size-7">Sources of raw data:</p>
                  <ul className="unordered">
                    {!!data?.gene?.species &&
                      data.gene.species.sourcesOfDataPerDataType.map(
                        (d, key) => (
                          <li key={key} className="is-size-7">
                            {`${d.dataType} data: `}
                            {d.sources.reduce((acc, s, sKey) => {
                              if (sKey !== 0)
                                acc.push(<span key={`comma-${sKey}`}>, </span>);
                              acc.push(
                                <LinkExternal key={sKey} to={s.baseUrl}>
                                  {s.name}
                                </LinkExternal>
                              );
                              return acc;
                            }, [])}
                          </li>
                        )
                      )}
                  </ul>
                </Bulma.Column>
              </Bulma.Columns>
            )}
          </>
        )}
        {!isLoading && !data && <span>No data</span>}
      </div>
    </>
  );
};

export default GeneExpressionTable;
