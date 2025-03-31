/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
import React, { useContext } from 'react';
import { TableContext } from '../../contexts/TableContext';
import { usePaginationLink } from '../../hooks/usePagination';

const Pagination = ({ current, total }) => {
  const { paginationParamPageKey, paginationResultCountKey } =
    useContext(TableContext);
  const { generatePaginationLink } = usePaginationLink(
    paginationParamPageKey,
    paginationResultCountKey
  );

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

  if (total === 1) return null;

  const disabledPrevious = current === 1;
  const disabledNext = current === total;
  return (
    <nav className="pagination is-small is-centered" aria-label="pagination">
      <a
        className="pagination-previous"
        role="link"
        disabled={disabledPrevious}
        href={disabledPrevious ? null : generatePaginationLink(current - 1)}
      >
        Previous
      </a>
      <a
        className="pagination-next"
        role="link"
        disabled={disabledNext}
        href={disabledNext ? null : generatePaginationLink(current + 1)}
      >
        Next
      </a>
      <ul className="pagination-list">
        <li>
          <a
            className={`pagination-link  ${current === 1 ? 'is-current' : ''}`}
            aria-label="Goto page 1"
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
            href={generatePaginationLink(total)}
          >
            {total}
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
