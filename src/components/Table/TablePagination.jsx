import React, { useContext } from 'react';
import {
  MEDIA_QUERIES,
  MEDIA_QUERIES_SIZE,
} from '../../helpers/constants/mediaQueries';
import Pagination from '../Pagination';
import { TableContext } from '../../contexts/TableContext';

const TablePagination = () => {
  const {
    table,
    data,
    usedWidth,
    pagination,
    currentPage,
    pageSize,
    manualMaxPage,
    isRequestPerPage,
  } = useContext(TableContext);

  const showEntriesText = React.useMemo(() => {
    if (isRequestPerPage) {
      const start = data.length ? (currentPage - 1) * pageSize + 1 : 0;
      const end =
        currentPage === manualMaxPage
          ? start + data.length - 1
          : start + pageSize - 1;
      return <p className="has-text-right">{`Showing ${start} to ${end}`}</p>;
    }

    return (
      <p className="has-text-right">
        {`Showing ${
          data.length ? ((currentPage - 1) * pageSize + 1).toString(10) : '0'
        } to ${(pageSize * currentPage > data.length
          ? data.length
          : pageSize * currentPage
        ).toString(10)} of ${data.length} entries`}
      </p>
    );
  }, [data, currentPage, pageSize, isRequestPerPage, manualMaxPage]);

  const totalPage = React.useMemo(
    () =>
      isRequestPerPage ? manualMaxPage : Math.ceil(data.length / pageSize) || 1,
    [data, pageSize, isRequestPerPage, manualMaxPage]
  );

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
        <Pagination
          current={currentPage}
          total={totalPage}
          isRequestPerPage={isRequestPerPage}
        />
      )}
    </div>
  );
};

export default TablePagination;
