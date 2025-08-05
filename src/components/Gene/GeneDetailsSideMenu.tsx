import React from 'react';
import { useNavigate, useLocation } from 'react-router';

import GENE_DETAILS_HTML_IDS from '../../helpers/constants/GeneDetailsHtmlIds';
import PATHS from '../../paths/paths';
import { URL_ROOT } from '~/helpers/constants';

const GeneDetailsSideMenu = ({
  homologs = null,
  xRefs,
}: {
  homologs: {
    orthologs: number;
    paralogs: number;
  } | null;
  xRefs: any;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handlerMenuClick = React.useCallback(
    (id: string) => {
      navigate(`${URL_ROOT}${location.pathname}${location.search}#${id}`, { replace: true });
    },
    [location]
  );

  return (
    <aside className="menu">
      <ul className="menu-list gene-menu">
        <li>
          <a href={`${PATHS.SUPPORT.TUTORIAL_GENE_PAGE}`} className="is-size-5 has-text-weight-semibold">
            See documentation
          </a>
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
        {homologs?.orthologs && homologs?.orthologs > 0 ? (
          <li key={GENE_DETAILS_HTML_IDS.ORTHOLOGS} onClick={() => handlerMenuClick(GENE_DETAILS_HTML_IDS.ORTHOLOGS)}>
            <a className="is-size-5 has-text-weight-semibold">Orthologs</a>
          </li>
        ) : (
          <></>
        )}
        {homologs?.paralogs && homologs?.paralogs > 0 ? (
          <li key={GENE_DETAILS_HTML_IDS.PARALOGS} onClick={() => handlerMenuClick(GENE_DETAILS_HTML_IDS.PARALOGS)}>
            <a className="is-size-5 has-text-weight-semibold">Paralogs</a>
          </li>
        ) : (
          <></>
        )}
        {xRefs && (
          <li key={GENE_DETAILS_HTML_IDS.XREFS} onClick={() => handlerMenuClick(GENE_DETAILS_HTML_IDS.XREFS)}>
            <a className="is-size-5 has-text-weight-semibold">Cross-references</a>
          </li>
        )}
      </ul>
    </aside>
  );
};

export default GeneDetailsSideMenu;
