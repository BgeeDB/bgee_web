/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Bulma from '../../../components/Bulma';
import Table from '../../../components/Table';
import obolibraryLinkFromID from '../../../helpers/obolibraryLinkFromID';
import { isEmpty } from '../../../helpers/arrayHelper';
import './rawDataAnnotations.scss';
import LinkExternal from '../../../components/LinkExternal';
import TagSource from '../../../components/TagSource/TagSource';
import { DATA_TYPES, PROC_EXPR_VALUES, RAW_DATA_ANNOTS } from './useLogic';
import PATHS from '../../../routes/paths';
import { getChildValueFromAttribute } from '../../../helpers/selects';
import config from '../../../config.json';

const APP_VERSION = config.version;
const URL_VERSION = APP_VERSION.replaceAll('.', '-');
const URL_ROOT = `${config.archive ? `/${URL_VERSION}` : ''}`;
const LINK_TO_RAW_DATA_ANNOTS = 'LINK_TO_RAW_DATA_ANNOTS';
const LINK_TO_PROC_EXPR_VALUES = 'LINK_TO_PROC_EXPR_VALUES';
const LINK_CALL_TO_PROC_EXPR_VALUES = 'LINK_CALL_TO_PROC_EXPR_VALUES';

const replaceNAOrUndefined = (txt) => {
  if (!txt || txt?.toLowerCase() === 'na') {
    return '';
  }
  return txt;
};

const customHeader = (searchElement, pageSizeElement) => (
  <Bulma.Columns vCentered>
    <Bulma.C>
      <div>{pageSizeElement}</div>
    </Bulma.C>
  </Bulma.Columns>
);

const RawDataAnnotationResults = ({
  results = [],
  columnDescriptions = [],
  maxPage,
  pageType,
  dataType,
  pageNumber,
  isExprCalls,
  searchParams
}) => {
  const loc = useLocation();

  const renderCells = ({ cell, key }, defaultRender) => {
    switch (cell[key].type) {
      case 'STRING':
      case 'NUMERIC':
        return <div>{cell[key].content}</div>;
      case 'INTERNAL_LINK':
        return (
          <Link className="internal-link" to={cell[key].to}>
            {cell[key].content}
          </Link>
        );
      case LINK_TO_RAW_DATA_ANNOTS:
      case LINK_CALL_TO_PROC_EXPR_VALUES:
      case LINK_TO_PROC_EXPR_VALUES:
        return <a href={cell[key].to}>{cell[key].content}</a>;
      case 'DEV_STAGE':
      case 'ANAT_ENTITY': {
        const content = cell[key].content;
        const path = cell[key].path;
        const renderAnatLink = content ? (
          <LinkExternal to={path} text={content} />
        ) : (
          ''
        );

        return <>{renderAnatLink}</>;
      }
      case 'DATA_TYPE_SOURCE': {
        const sourceObject = cell[key].sourceObject;
        return <TagSource source={sourceObject} />;
      }
      default:
        return defaultRender([cell[key]]);
    }
  };

  const mappedResults = useMemo(
    () =>
      results.map((result) => {
        const row = columnDescriptions.map((col) => {
          const attribute0 = col?.attributes?.[0];
          const valueFromFirstAttribute = getChildValueFromAttribute(
            result,
            attribute0
          );
          switch (col.columnType) {
            case 'STRING': {
              return {
                type: col.columnType,
                content: col.attributes
                  .map((att) => getChildValueFromAttribute(result, att))
                  .join(' '),
              };
            }
            case 'INTERNAL_LINK': {
              let path = `${URL_ROOT}/${col.linkTarget}/${valueFromFirstAttribute}`;
              if (col?.linkTarget === 'gene') {
                const geneMappedToSameGeneIdCount = getChildValueFromAttribute(
                  result,
                  col?.geneMappedToSameGeneIdCountResultAttribute
                );

                if (geneMappedToSameGeneIdCount > 1) {
                  const specieId = getChildValueFromAttribute(
                    result,
                    col?.geneSpeciesIdResultAttribute
                  );

                  path += `/${specieId}`;
                }
              }
              return {
                type: col.columnType,
                content: valueFromFirstAttribute,
                to: path,
              };
            }
            case 'ANAT_ENTITY':
            case 'DEV_STAGE': {
              const id = replaceNAOrUndefined(valueFromFirstAttribute);
              const path = obolibraryLinkFromID(id || '');
              return {
                type: col.columnType,
                content: id,
                path,
              };
            }
            case 'NUMERIC': {
              return {
                type: col.columnType,
                content: valueFromFirstAttribute,
              };
            }
            case 'DATA_TYPE_SOURCE': {
              let source = '';
              Object.entries(valueFromFirstAttribute).forEach(
                ([key, value]) => {
                  if (value) {
                    source += `${key} - `;
                  }
                }
              );
              return {
                type: col.columnType,
                content: source.slice(0, -2),
                sourceObject: valueFromFirstAttribute,
              };
            }
            case LINK_TO_RAW_DATA_ANNOTS:
            case LINK_TO_PROC_EXPR_VALUES:
            case LINK_CALL_TO_PROC_EXPR_VALUES: {
              const nextPageType =
                col.columnType === LINK_TO_RAW_DATA_ANNOTS
                  ? RAW_DATA_ANNOTS
                  : PROC_EXPR_VALUES;
              const currentSP = new URLSearchParams(loc.search);
              col?.filterTargets?.forEach((filter) => {
                const filterValue = getChildValueFromAttribute(
                  result,
                  filter?.valueAttributeName
                );
                if (filterValue) {
                  currentSP.append(filter?.urlParameterName, filterValue);
                }
              });
              currentSP.delete('pageType');
              currentSP.append('pageType', nextPageType);

              currentSP.append('filters_for_all', '1');

              currentSP.delete('data_type');
              currentSP.append(
                'data_type',
                isExprCalls ? DATA_TYPES[0].id : dataType
              );

              currentSP.delete('cell_type_descendant');
              currentSP.append('cell_type_descendant', searchParams().hasCellTypeSubStructure ?? false);
              currentSP.delete('stage_descendant');
              currentSP.append('stage_descendant', searchParams().hasDevStageSubStructure ?? false);
              currentSP.delete('anat_entity_descendant');
              currentSP.delete('pageNumber');
              currentSP.append('anat_entity_descendant', searchParams().hasTissueSubStructure ?? false);
              currentSP.delete('only_propagated');
              currentSP.append('only_propagated', searchParams().onlyPropagated ?? true);
              return {
                type: col.columnType,
                content: 'Browse results',
                to: `${
                  PATHS.SEARCH.RAW_DATA_ANNOTATIONS
                }?${currentSP.toString()}`,
              };
            }
            default:
              return {};
          }
        });
        return row;
      }),
    [results, columnDescriptions]
  );

  const buildTSVhref = useMemo(() => {
    const base = `data:text/tab-separated-values;charset=utf-8,`;
    const colHeaders = [];

    // We create column headers by filtering the export = false
    columnDescriptions
      .filter((col) => col.export)
      .forEach((column) => {
        colHeaders.push(column.title);
      });
    let tsv = colHeaders.join('%09');
    tsv += '%0D%0A'; // carriage return

    const columnsToExport = columnDescriptions
      .map((c, i) => ({ ...c, indexForExport: i })) // We are adding indexes to know where to get our value in result
      .filter((col) => col.export); // filtering export = false

    mappedResults.forEach((row) => {
      const rowTxt = columnsToExport
        .map((col) => encodeURIComponent(row[col.indexForExport].content)) // We get the result only from the column we need to export
        .join('%09');
      tsv += `${rowTxt}%0D%0A`; // carriage return
    });

    return `${base}${tsv}`;
  }, [mappedResults]);

  if (isEmpty(columnDescriptions)) {
    return null;
  }

  return (
    <>
      {results?.length > 0 && (
        <div className="my-2 is-flex is-justify-content-flex-end">
          <Bulma.Button
            className="download-btn is-small"
            href={buildTSVhref}
            renderAs="a"
            download={`Bgee-${pageType}_${
              isExprCalls ? '' : `${dataType}_`
            }${pageNumber}.tsv`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Export current page in TSV
            <span className="icon is-small ml-1">
              <ion-icon name="download-outline" />
            </span>
          </Bulma.Button>
        </div>
      )}
      <Table
        title={
          isExprCalls
            ? 'Order of results is independent of expression level'
            : null
        }
        pagination
        defaultPaginationSize={50}
        classNamesTable="is-striped"
        columns={columnDescriptions}
        data={mappedResults}
        customHeader={customHeader}
        onRenderCell={renderCells}
        paginationParamPageKey="pageNumber"
        paginationResultCountKey="limit"
        isRequestPerPage
        manualMaxPage={maxPage}
        fullwidth={false}
        minThWidth="10rem"
        hasPaginationTop
        hasScrollTop
      />
    </>
  );
};

export default RawDataAnnotationResults;
