import React, { useContext } from 'react';
import { Link } from 'react-router';
import { TableContext } from '../../contexts/TableContext';
import { usePaginationLink } from '../../hooks/usePagination';

const disabledStyle = { pointerEvents: 'none' as const, opacity: 0.5, cursor: 'not-allowed' };

const Pagination = ({ current, total }) => {
  const { paginationParamPageKey, paginationResultCountKey }: any = useContext(TableContext);
  const { generatePaginationLink } = usePaginationLink(paginationParamPageKey, paginationResultCountKey);

  const center = React.useMemo(() => {
    const pages = [];
    const pageBtw = total - 2;
    if (pageBtw <= 3) {
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
      <Link
        className="pagination-previous"
        role="link"
        style={disabledPrevious ? disabledStyle : {}}
        to={generatePaginationLink(current - 1)}
      >
        Previous
      </Link>
      <Link
        className="pagination-next"
        role="link"
        style={disabledNext ? disabledStyle : {}}
        to={generatePaginationLink(current + 1)}
      >
        Next
      </Link>
      <ul className="pagination-list">
        <li>
          <Link
            className={`pagination-link  ${current === 1 ? 'is-current' : ''}`}
            aria-label="Goto page 1"
            to={generatePaginationLink(1)}
          >
            1
          </Link>
        </li>
        {total > 5 && current > 2 && (
          <li>
            <span className="pagination-ellipsis">&hellip;</span>
          </li>
        )}
        {center.map(page => (
          <li key={page}>
            <Link
              className={`pagination-link  ${current === page ? 'is-current' : ''}`}
              aria-label={`Go to page ${page}`}
              to={generatePaginationLink(page)}
            >
              {page}
            </Link>
          </li>
        ))}
        {total > 5 && current < total - 1 && (
          <li>
            <span className="pagination-ellipsis">&hellip;</span>
          </li>
        )}
        <li>
          <Link
            className={`pagination-link  ${current === total ? 'is-current' : ''}`}
            aria-label={`Goto page ${total}`}
            to={generatePaginationLink(total)}
          >
            {total}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
