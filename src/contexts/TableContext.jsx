import React from 'react';

const TableContext = React.createContext({});
const { Provider } = TableContext;

const TableProvider = ({ children, data }) => (
  <Provider value={data}>{children}</Provider>
);

export { TableContext, TableProvider };
