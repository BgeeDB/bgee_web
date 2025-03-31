/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
import React, { useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { TableContext } from '../../contexts/TableContext';
import { usePaginationLink } from '../../hooks/usePagination';
import config from '../../config.json';

const APP_VERSION = config.version;
const URL_VERSION = APP_VERSION.replaceAll('.', '-');
const URL_ROOT = `${config.archive ? `/${URL_VERSION}` : ''}`;

const PaginationWithoutRefresh = ({ current, total }) => {
  const { paginationParamPageKey, paginationResultCountKey } =
    useContext(TableContext);
  const { generatePaginationLink } = usePaginationLink(
    paginationParamPageKey,
    paginationResultCountKey
  );

  const history = useHistory();
  const loc = useLocation();
  const sp = new URLSearchParams(loc.search);

  const center = React.useMemo(() => {
    const pages = [];
    const pageBtw = total - 2;
    if (pageBtw <= 3) {
      // eslint-disable-next-line no-plusplus
      for (let i = 1; i <= pageBtw; ++i) pages.push(i + 1);
    } else if (current === 1) {
      pages.push(current + 1);
      pages.push(current + 2);
      pages.push(current + 3);
    } else if (current - 1 === 1) {
      pages.push(current);
      pages.push(current + 1);
      pages.push(current + 2);
    } else if (current + 1 === total) {
      pages.push(current - 2);
      pages.push(current - 1);
      pages.push(current);
    } else if (current === total) {
      pages.push(current - 3);
      pages.push(current - 2);
      pages.push(current - 1);
    } else {
      pages.push(current - 1);
      pages.push(current);
      pages.push(current + 1);
    }

    return pages;
  }, [current, total]);

  const goToPage = (e, targetPage) => {
    e.preventDefault();
    e.stopPropagation();
    sp.set(paginationParamPageKey, targetPage);
    history.push({ search: `?${sp.toString()}`, pathname: `${URL_ROOT}${loc.pathname}` });
  };

  if (total === 1) return null;

  const disabledPrevious = current === 1;
  const disabledNext = current === total;
  return (
    <nav className="pagination is-small is-centered" aria-label="pagination">
      <a
        className="pagination-previous"
        role="link"
        disabled={disabledPrevious}
        onClick={(e) => !disabledPrevious && goToPage(e, current - 1)}
      >
        Previous
      </a>
      <a
        className="pagination-next"
        role="link"
        disabled={disabledNext}
        onClick={(e) => !disabledNext && goToPage(e, current + 1)}
      >
        Next
      </a>
      <ul className="pagination-list">
        <li>
          <a
            className={`pagination-link  ${current === 1 ? 'is-current' : ''}`}
            aria-label="Goto page 1"
            onClick={(e) => goToPage(e, 1)}
            href={generatePaginationLink(1)}
          >
            1
          </a>
        </li>
        {total > 5 && current > 2 && (
          <li>
            <span className="pagination-ellipsis">&hellip;</span>
          </li>
        )}
        {center.map((page) => (
          <li key={page}>
            <a
              className={`pagination-link  ${
                current === page ? 'is-current' : ''
              }`}
              aria-label={`Go to page ${page}`}
              onClick={(e) => goToPage(e, page)}
              href={generatePaginationLink(page)}
            >
              {page}
            </a>
          </li>
        ))}
        {total > 5 && current < total - 1 && (
          <li>
            <span className="pagination-ellipsis">&hellip;</span>
          </li>
        )}
        <li>
          <a
            className={`pagination-link  ${
              current === total ? 'is-current' : ''
            }`}
            aria-label={`Goto page ${total}`}
            onClick={(e) => goToPage(e, total)}
            href={generatePaginationLink(total)}
          >
            {total}
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default PaginationWithoutRefresh;
