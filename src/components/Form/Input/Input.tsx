const Input = ({
  controlClassName,
  icons,
  className,
  onChange,
  error,
  ...props
}: any) => (
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
