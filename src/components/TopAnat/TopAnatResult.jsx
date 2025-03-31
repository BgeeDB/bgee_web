/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */
import React from 'react';
import { Helmet } from 'react-helmet';
import Bulma from '../Bulma';
import classnames from '../../helpers/classnames';
import { TOP_ANAT_FLOW } from '../../hooks/useTopAnat';
import GaEvent from '../GaEvent/GaEvent';
import LinkExternal from '../LinkExternal';
import Table from '../Table';
import config from '../../config.json';
import obolibraryLinkFromID from '../../helpers/obolibraryLinkFromID';
import { topAnatSorter } from '../../helpers/sortTable';

const COLUMNS = [
  {
    key: 'anatEntityId',
    text: 'Anat Entity ID',
  },
  {
    key: 'anatEntityName',
    text: 'Anat Entity Name',
  },
  {
    key: 'annotated',
    text: 'Annotated',
  },
  {
    key: 'significant',
    text: 'Significant',
  },
  {
    key: 'expected',
    text: 'Expected',
  },
  {
    key: 'foldEnrichment',
    text: 'Fold Enrichment',
  },
  {
    key: 'pValue',
    text: 'P value',
  },
  {
    key: 'FDR',
    text: 'Fdr',
  },
];
const MERGE_KEY = 'merge';

const TopAnatResult = ({
  results,
  searchId,
  fg,
  status,
  title,
  jobId,
  data,
}) => {
  const [selectedStage, setSelectedStage] = React.useState(MERGE_KEY);
  const topAnatResults = results?.analysis;
  const analysisName = data?.jobDescription;
  const metaTitle = `${
    jobId
      ? `analysis ${jobId} running`
      : `${
          topAnatResults
            ? `analysis results ${analysisName}`
            : ' - Gene expression enrichment analysis'
        }`
  }`;
  const metaDescription = `${
    jobId
      ? `A TopAnat analysis is running, this page will be updated when the results are available.`
      : `${
          topAnatResults
            ? `TopAnat analysis results ${
                analysisName ? `for analysis: ${analysisName}` : ''
              }`
            : 'TopAnat: perform GO-like enrichment of anatomical terms, mapped to genes by expression patterns.'
        }`
  }`;
  const onRenderCell = React.useCallback(({ cell, key }, defaultRender) => {
    if (key === 0)
      return (
        <LinkExternal to={obolibraryLinkFromID(cell)}>{cell}</LinkExternal>
      );
    return defaultRender(cell, key);
  }, []);
  const onFilter = React.useCallback(
    (search) => (element) =>
      Boolean(new RegExp(search, 'i').test(element[0])) ||
      Boolean(new RegExp(search, 'i').test(element[1])),
    []
  );
  const dataCsvHref = React.useMemo(() => {
    let csvContent =
      'data:text/tab-separated-values;charset=utf-8,Anat Entity ID%09Anat Entity ID%09Annotated%09Significant%09Expected%09Fold Enrichment%09P value%09Fdr%0D%0A';
    if (results?.data)
      results?.data.forEach((row) => {
        csvContent += `${[
          row.anatEntityId,
          row.anatEntityName,
          row.annotated,
          row.significant,
          row.expected,
          row.foldEnrichment,
          row.pValue,
          row.FDR,
        ].join('%09')}%0D%0A`;
      });

    return csvContent;
  }, [results]);
  const mappingObj = React.useCallback((obj) => {
    try {
      const {
        anatEntityId,
        anatEntityName,
        annotated,
        significant,
        expected,
        foldEnrichment,
        pValue,
        FDR,
      } = obj;
      return [
        anatEntityId,
        anatEntityName,
        annotated,
        significant,
        expected,
        foldEnrichment,
        pValue,
        FDR,
      ];
    } catch (e) {
      console.log(e);
    }
    return obj;
  }, []);

  const dataDisplay = React.useMemo(() => {
    if (status !== TOP_ANAT_FLOW.GOT_RESULTS) return null;
    if (!results || !results.analysis) return null;
    if (selectedStage === MERGE_KEY) return results.data;

    return (
      results.analysis.find((a) => a.devStageId === selectedStage)?.results ||
      null
    );
  }, [status, results, selectedStage]);

  const customHeader = React.useCallback(
    (searchElement, pageSizeElement) =>
      dataDisplay.length > 0 ? (
        <>
          <Bulma.Columns vCentered>
            <Bulma.C size={4}>
              <div className="is-flex is-flex-direction-column">
                <p>Download R scripts and data</p>
                <GaEvent
                  category="Top Anat"
                  action="Download R scripts and data"
                  label={`All - ${config.apiDomain}/?page=top_anat&action=download&data=${searchId}`}
                >
                  <Bulma.Button
                    href={`${config.apiDomain}/?page=top_anat&action=download&data=${searchId}`}
                    color="danger"
                    light
                    style={{ width: 'fit-content' }}
                    rel="noopener noreferrer"
                    renderAs="a"
                    size="small"
                  >
                    All stages, expression type &quot;Present&quot;
                    <span className="icon ml-1">
                      <ion-icon name="download-outline" size="large" />
                    </span>
                  </Bulma.Button>
                </GaEvent>
                {results.analysis.length > 1 &&
                  results.analysis.map((r) => (
                    <GaEvent
                      key={r.zipFile}
                      category="Top Anat"
                      action="Download R scripts and data"
                      label={`${
                        fg.list.stages.find((s) => s.id === r.devStageId)?.name
                      } - ${r.zipFile}`}
                    >
                      <Bulma.Button
                        href={r.zipFile}
                        color="danger"
                        light
                        style={{ width: 'fit-content' }}
                        rel="noopener noreferrer"
                        renderAs="a"
                        size="small"
                        className="mt-1"
                      >
                        {`${
                          fg.list.stages.find((s) => s.id === r.devStageId)
                            ?.name
                        }, expression type "Present" (${r.results.length})`}
                        <span className="icon is-small">
                          <ion-icon name="download-outline" size="large" />
                        </span>
                      </Bulma.Button>
                    </GaEvent>
                  ))}
              </div>
            </Bulma.C>
            <Bulma.C size={5}>
              <div className="is-flex is-flex-direction-row">
                {searchElement}
                <div className="ml-2 control">
                  <a
                    className="button"
                    href={dataCsvHref}
                    download="Bgee-TopAnat-data.tsv"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>TSV</span>
                    <span className="icon is-small">
                      <ion-icon name="download-outline" />
                    </span>
                  </a>
                </div>
              </div>
            </Bulma.C>
            <Bulma.C size={3}>
              <div>{pageSizeElement}</div>
            </Bulma.C>
          </Bulma.Columns>
          {results.analysis.length > 1 && (
            <div className="tabs">
              <ul>
                <li
                  className={classnames({
                    'is-active': selectedStage === MERGE_KEY,
                  })}
                  onClick={() => {
                    if (selectedStage !== MERGE_KEY)
                      setSelectedStage(MERGE_KEY);
                  }}
                >
                  <a>All stages</a>
                </li>
                {results.analysis.map((analysis) => (
                  <li
                    key={analysis.devStageId}
                    className={classnames({
                      'is-active': selectedStage === analysis.devStageId,
                    })}
                    onClick={() => {
                      if (selectedStage !== analysis.devStageId)
                        setSelectedStage(analysis.devStageId);
                    }}
                  >
                    <a>
                      {
                        fg.list.stages.find((s) => s.id === analysis.devStageId)
                          ?.name
                      }
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : null,
    [fg, results, dataCsvHref, selectedStage, dataDisplay]
  );

  if (
    status === TOP_ANAT_FLOW.GOT_RESULTS &&
    dataDisplay &&
    dataDisplay.length > 0
  )
    return (
      <>
        <Helmet>
          <title>TopAnat {metaTitle}</title>
          <meta property='og:title' content={`TopAnat ${metaTitle}`} />
          <meta name="description" content={metaDescription} />
          <meta property='og:description' content={metaDescription} />
          <meta name="keywords" content="TopAnat, gene set enrichment analysis, gene expression enrichment analysis, GO-like enrichment analysis, gene expression patterns, topGO, BgeeDB" />
        </Helmet>
        <div className="content has-text-centered">
          <p className="title is-4">{title}</p>
        </div>
        <Table
          key={searchId + selectedStage}
          columns={COLUMNS}
          data={dataDisplay}
          onSortCustom={topAnatSorter}
          onRenderCell={onRenderCell}
          sortable
          multiSortable
          pagination
          defaultPaginationSize={20}
          onFilter={onFilter}
          striped
          customHeader={customHeader}
          mappingObj={mappingObj}
        />
      </>
    );
  return null;
};

export default TopAnatResult;
