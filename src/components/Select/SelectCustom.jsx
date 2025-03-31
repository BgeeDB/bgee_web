/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
import React from 'react';
import useDetectClickOutside from '../../hooks/useDetectClickOutside';

/*
 * elements {Array} of {key: string|number, text: string}
 * value {string|number|Array of (string|number)}
 */
const SelectCustom = ({ onChange, multiple = false, value, elements = [] }) => {
  const [active, setActive] = React.useState(false);
  const ref = useDetectClickOutside(() => setActive(false));

  const toggle = React.useCallback(
    (e) => {
      e.stopPropagation();
      setActive(!active);
    },
    [active]
  );
  const onClickItem = React.useCallback(
    (val) => (e) => {
      e.stopPropagation();
      const tmp = multiple ? [...value, val] : val;
      if (onChange) onChange(tmp);
      if (!multiple) setActive(false);
    },
    [multiple, onChange, value]
  );
  const isSelected = (key) => {
    if (!multiple) return value === key;
    return value.findIndex((v) => v === key) !== -1;
  };

  return (
    <div ref={ref} className={`select-wrapper ${active ? 'active' : ''}`}>
      {/* <div className="select-background" /> */}
      <div
        onClick={toggle}
        className="select select-input is-flex is-align-items-center"
      >
        <p>{Array.isArray(value) ? value.join(', ') : value}</p>
      </div>
      <div className="select-body">
        {elements.map((e) => (
          <div
            key={e.key}
            className={`select-item ${isSelected(e.key) ? 'selected' : ''}`}
            onClick={onClickItem(e.key)}
          >
            <input
              type="checkbox"
              className="mr-2"
              checked={isSelected(e.key)}
              readOnly
            />
            <p className="checkbox">{e.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectCustom;
