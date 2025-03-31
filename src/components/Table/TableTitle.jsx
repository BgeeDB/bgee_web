import { useContext } from 'react';
import { TableContext } from '../../contexts/TableContext';

const TableTitle = () => {
  const { title } = useContext(TableContext);
  return title ? (
    <p className="has-text-centered has-text-weight-semibold mb-1">{title}</p>
  ) : null;
};

export default TableTitle;
