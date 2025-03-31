/* eslint-disable react/no-array-index-key */
import { useContext } from 'react';
import { isHideMediaQuery } from '../../helpers/constants/mediaQueries';
import { TableContext } from '../../contexts/TableContext';
import HelpIcon from '../HelpIcon';
import './override.scss';
import classnames from '../../helpers/classnames';

const cssSortOption = (key, sortOpts) => {
  let pos;
  let type;
  if (sortOpts) {
    if (Array.isArray(sortOpts)) {
      pos = sortOpts.findIndex((s) => s.key === key);
      if (pos >= 0) {
        type = sortOpts[pos].sort;
        pos += 1;
      }
    } else if (sortOpts.key === key) type = sortOpts.sort;
  }

  if (type === 'descending')
    return (
      <>
        <span className="icon is-small">
          <ion-icon name="caret-down-outline" />
        </span>
        {typeof pos === 'number' && <sup>{pos}</sup>}
      </>
    );
  if (type === 'ascending')
    return (
      <>
        <span className="icon is-small">
          <ion-icon name="caret-up-outline" />
        </span>
        {typeof pos === 'number' && <sup>{pos}</sup>}
      </>
    );

  return null;
};
const TableHead = ({ minThWidth }) => {
  const {
    columns,
    sortable,
    sortOption,
    defineSortOption,
    showTableModalButton,
    usedWidth,
  } = useContext(TableContext);
  const minWidthStyle = minThWidth ? { minWidth: minThWidth } : {};
  return (
    <thead>
      <tr>
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        {showTableModalButton && <th />}
        {columns.map((item, key) => {
          const itemStyle = item.style ? item.style : {};
          const thStyle = { ...itemStyle, ...minWidthStyle };
          if (typeof item === 'object') {
            if (isHideMediaQuery(usedWidth, item.hide)) return null;
            return (
              <th
                className={classnames(!!item.infoBubble && 'hasInfoBubble')}
                key={key}
                onClick={
                  sortable && !item.noSort
                    ? defineSortOption(item.key)
                    : undefined
                }
                style={thStyle}
              >
                <div style={{ display: 'flex' }}>
                  {item?.text || item?.title}
                  {cssSortOption(item.key, sortOption)}
                  {item.infoBubble && (
                    <HelpIcon
                      isLeft={key > columns.length / 2}
                      title={item.text}
                      className="helpIcon"
                      iconName="information-circle"
                      content={item.infoBubble}
                    />
                  )}
                </div>
              </th>
            );
          }
          return <th key={key}>{item}</th>;
        })}
      </tr>
    </thead>
  );
};

export default TableHead;
