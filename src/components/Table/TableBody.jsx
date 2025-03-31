/* eslint-disable react/no-array-index-key,jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */
import React, { useContext } from 'react';
import classnames from '../../helpers/classnames';
import { isHideMediaQuery } from '../../helpers/constants/mediaQueries';
import { TableContext } from '../../contexts/TableContext';
import Bulma from '../Bulma';
import { ModalContext } from '../../contexts/ModalContext';
import staticBuilder from '../../helpers/staticBuilder';
import uuid from '../../helpers/uuid';

const PlusModalCell = ({ row, defaultRender }) => {
  const { showModal, hideModal } = React.useContext(ModalContext);
  const { columns, onRenderCell, showTableModalButton } =
    useContext(TableContext);

  const showModalDetails = React.useCallback(
    (item) => () => {
      console.log(columns, item);
      let titleModal = 'Details';
      if (item?.condition?.anatEntity)
        titleModal += ` in ${item?.condition?.anatEntity.name}`;

      showModal(() => (
        <Bulma.Modal.Card.Wrapper>
          <Bulma.Modal.Card.Header>
            <Bulma.Modal.Card.Title>{titleModal}</Bulma.Modal.Card.Title>
            {/* eslint-disable-next-line react/button-has-type */}
            <button className="delete" aria-label="close" onClick={hideModal} />
          </Bulma.Modal.Card.Header>
          <Bulma.Modal.Card.Body>
            <div className="gene-expression-modal-grid">
              {columns.map((col) => (
                <React.Fragment key={col.key}>
                  <div className="label">{col.text}</div>
                  <div>
                    {typeof onRenderCell === 'function'
                      ? onRenderCell(
                          { cell: item, key: col.key },
                          defaultRender,
                          {
                            expandAction: () => {},
                            isExpanded: true,
                          }
                        )
                      : defaultRender(item, col.key)}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </Bulma.Modal.Card.Body>
        </Bulma.Modal.Card.Wrapper>
      ));
    },
    [columns, onRenderCell, defaultRender]
  );
  return showTableModalButton ? (
    <td className="table-modal-button" onClick={showModalDetails(row)}>
      <ion-icon name="add-circle" />
    </td>
  ) : null;
};

const TableBody = () => {
  const {
    columns,
    data,
    expandAction,
    isExpanded,
    onRenderRow,
    onRenderCell,
    usedWidth,
    currentPage,
    pageSize,
    isRequestPerPage,
  } = useContext(TableContext);
  const defaultRender = React.useCallback(
    (cell, key) => {
      let style;
      const col = columns.find((c) => c?.key === key);
      if (col && col.style) {
        style = columns.find((c) => c?.key === key).style;
      }
      if (typeof cell === 'string' || typeof cell === 'number')
        return (
          <span key={key + uuid()} style={style}>
            {cell}
          </span>
        );

      return Array.isArray(cell) ? (
        <div key={key} style={style}>
          {staticBuilder(cell)}
        </div>
      ) : null;
    },
    [columns, usedWidth]
  );

  const dataToDisplay = React.useMemo(
    () =>
      !isRequestPerPage
        ? data?.slice(
            (currentPage - 1) * pageSize,
            (currentPage - 1) * pageSize + pageSize
          )
        : data,
    [data, currentPage, pageSize, isRequestPerPage]
  );

  return (
    <tbody>
      {dataToDisplay.map((row, key) => (
        <tr
          key={key}
          className={classnames(
            { 'is-expanded': isExpanded[key] },
            onRenderRow
              ? onRenderRow(row, key > 0 ? data[key - 1] : null, key)
              : undefined
          )}
        >
          <PlusModalCell row={row} defaultRender={defaultRender} />
          {Array.isArray(row)
            ? row.map((cell, cellKey) => (
                <td key={`${key}-${cellKey}`} style={columns?.[cellKey]?.style}>
                  {onRenderCell
                    ? onRenderCell(
                        { cell, key: cellKey, keyRow: key },
                        defaultRender,
                        {
                          expandAction: expandAction(key),
                          isExpanded: isExpanded[key],
                        }
                      )
                    : defaultRender(cell, cellKey)}
                </td>
              ))
            : columns.map((c, keyCol) =>
                isHideMediaQuery(usedWidth, c.hide) ? null : (
                  <td
                    key={`${key}-col-${keyCol}`}
                    style={columns?.[keyCol]?.style}
                  >
                    {onRenderCell
                      ? onRenderCell(
                          { cell: row, key: c.key || keyCol, keyRow: key },
                          defaultRender,
                          {
                            expandAction: expandAction(key),
                            isExpanded: isExpanded[key],
                          }
                        )
                      : null}
                  </td>
                )
              )}
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
