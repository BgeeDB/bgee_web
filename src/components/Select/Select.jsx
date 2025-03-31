import React from 'react';

/*
options {Array} of string or {value, text}
 */
const Select = ({
  title = 'defaultTitle',
  defaultValue,
  options,
  onChange,
  value,
}) => {
  const [active, setActive] = React.useState(defaultValue || '');

  const hasValueProps = typeof value !== 'undefined' && value !== null;

  const onChangeSelect = React.useCallback(
    (e) => {
      if (!hasValueProps) {
        setActive(e.target.value);
      }
      if (onChange) onChange(e.target.value);
    },
    [hasValueProps, onChange]
  );

  return (
    <div className="select">
      <select
        title={title}
        value={hasValueProps ? value : active}
        onChange={onChangeSelect}
      >
        {options.map((opt) =>
          // eslint-disable-next-line valid-typeof
          ['string', 'number'].find((t) => t === typeof opt) ? (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ) : (
            <option key={opt.value} value={opt.value}>
              {opt.text}
            </option>
          )
        )}
      </select>
    </div>
  );
};

export default Select;
