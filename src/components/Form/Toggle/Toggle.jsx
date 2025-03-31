const Toggle = ({
  controlClassName,
  elements,
  value,
  onChange,
  error,
  disabled,
}) => (
  <div className={`control ${controlClassName || ''}`}>
    <div className="field has-addons">
      {elements.map((element) => (
        <p key={element.key || element.value} className="control">
          <button
            className={`button ${value === element.value ? 'is-primary' : ''}`}
            disabled={value === element.value || disabled}
            type="button"
            onClick={disabled ? undefined : () => onChange(element.value)}
          >
            <span>{element.text}</span>
          </button>
        </p>
      ))}
    </div>
    {error && <p className="help is-danger">{error}</p>}
  </div>
);

export default Toggle;
