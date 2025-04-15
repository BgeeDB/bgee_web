const TextArea = ({
  controlClassName,
  className,
  onChange,
  error,
  ...props
}: any) => (
  <div className={`control ${controlClassName || ''}`}>
    <textarea
      className={`textarea ${className || ''} ${error ? 'is-danger' : ''}`}
      onChange={onChange}
      {...props}
    />
    {error && <p className="help is-danger">This field is required</p>}
  </div>
);

export default TextArea;
