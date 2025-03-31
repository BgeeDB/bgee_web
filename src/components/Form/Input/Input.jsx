const Input = ({
  controlClassName,
  icons,
  className,
  onChange,
  error,
  ...props
}) => (
  <div className={`control ${controlClassName || ''}`}>
    <input
      className={`input ${className || ''} ${error ? 'is-danger' : ''}`}
      onChange={onChange}
      {...props}
    />
    {error && <p className="help is-danger">{error}</p>}
    {icons}
  </div>
);

export default Input;
