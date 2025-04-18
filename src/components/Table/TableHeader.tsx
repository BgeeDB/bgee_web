import { useContext } from 'react';
import { TableContext } from '../../contexts/TableContext';

const TableHeader = () => {
  const { customHeader, searchInput, pageSizeSelector, data }: any = useContext(TableContext);

  return customHeader ? customHeader(searchInput, pageSizeSelector, data) : null;
};

export default TableHeader;
