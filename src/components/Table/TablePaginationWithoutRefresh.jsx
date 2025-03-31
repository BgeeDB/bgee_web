import React, { useContext } from 'react';
import {
  MEDIA_QUERIES,
  MEDIA_QUERIES_SIZE,
} from '../../helpers/constants/mediaQueries';
import { TableContext } from '../../contexts/TableContext';
import PaginationWithoutRefresh from '../PaginationWithoutRefresh/PaginationWithoutRefresh';

const TablePaginationWithoutRefresh = () => {
  const {
    table,
    data,
    usedWidth,
    pagination,
    currentPage,
    pageSize,
    manualMaxPage = 1,
  } = useContext(TableContext);

  const showEntriesText = React.useMemo(() => {
    const start = data.length ? (currentPage - 1) * pageSize + 1 : 0;
    const end =
      currentPage === manualMaxPage
        ? start + data.length - 1
        : start + pageSize - 1;
    return <p className="has-text-right">{`Showing ${start} to ${end}`}</p>;
  }, [data, currentPage, pageSize, manualMaxPage]);

  if (data.length === 0) return null;

  return (
    <div
      ref={table}
      className={`complex-table-footer my-3 is-flex is-justify-content-space-between${
        usedWidth <= MEDIA_QUERIES_SIZE[MEDIA_QUERIES.TABLET] ? ' tablet' : ''
      }`}
    >
      <div>{showEntriesText}</div>
      {pagination && (
        <PaginationWithoutRefresh current={currentPage} total={manualMaxPage} />
      )}
    </div>
  );
};

export default TablePaginationWithoutRefresh;
