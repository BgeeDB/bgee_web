/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import GENE_DETAILS_HTML_IDS from '../../helpers/constants/GeneDetailsHtmlIds';
import PATHS from '../../routes/paths';
import config from '../../config.json';

const APP_VERSION = config.version;
const URL_VERSION = APP_VERSION.replaceAll('.', '-');
const URL_ROOT = `${config.archive ? `/${URL_VERSION}` : ''}`;

const GeneDetailsSideMenu = ({ homologs = null, xRefs }) => {
  const history = useHistory();
  const location = useLocation();

  const handlerMenuClick = React.useCallback(
    (id) => {
      history.replace(`${URL_ROOT}${location.pathname}${location.search}#${id}`);
    },
    [location]
  );

  return (
    <aside className="menu">
      <ul className="menu-list gene-menu">
        <li>
          <a href={`${PATHS.SUPPORT.TUTORIAL_GENE_PAGE}`} className="is-size-5 has-text-weight-semibold">See documentation</a>
        </li>
        <li onClick={() => handlerMenuClick(GENE_DETAILS_HTML_IDS.GENERAL_INFORMATION)}>
          <a className="is-size-5 has-text-weight-semibold">General information</a>
        </li>
        <li onClick={() => handlerMenuClick(GENE_DETAILS_HTML_IDS.EXPRESSION_GRAPH)}>
          <a className="is-size-5 has-text-weight-semibold">Expression graph</a>
        </li>
        <li onClick={() => handlerMenuClick(GENE_DETAILS_HTML_IDS.EXPRESSION_TABLE)}>
          <a className="is-size-5 has-text-weight-semibold">Expression table</a>
        </li>
        <li onClick={() => handlerMenuClick(GENE_DETAILS_HTML_IDS.EXPRESSION_ABSENT_TABLE)}>
          <a className="is-size-5 has-text-weight-semibold">Expression Absent</a>
        </li>
        {homologs?.orthologs > 0 && (
          <li
            key={GENE_DETAILS_HTML_IDS.ORTHOLOGS}
            onClick={() => handlerMenuClick(GENE_DETAILS_HTML_IDS.ORTHOLOGS)}
          >
            <a className="is-size-5 has-text-weight-semibold">Orthologs</a>
          </li>
        )}
        {homologs?.paralogs > 0 && (
          <li
            key={GENE_DETAILS_HTML_IDS.PARALOGS}
            onClick={() => handlerMenuClick(GENE_DETAILS_HTML_IDS.PARALOGS)}
          >
            <a className="is-size-5 has-text-weight-semibold">Paralogs</a>
          </li>
        )}
        {xRefs && (
          <li
            key={GENE_DETAILS_HTML_IDS.XREFS}
            onClick={() => handlerMenuClick(GENE_DETAILS_HTML_IDS.XREFS)}
          >
            <a className="is-size-5 has-text-weight-semibold">
              Cross-references
            </a>
          </li>
        )}
      </ul>
    </aside>
  );
};

export default GeneDetailsSideMenu;
