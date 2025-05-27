const Input = ({
  controlClassName,
  icons,
  className,
  onChange,
  error,
  ...props
}: {
  controlClassName?: string;
  icons?: React.ReactNode;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | boolean;
  [key: string]: any;
}) => (
  <div className={`control ${controlClassName || ''}`}>
    <input className={`input ${className || ''} ${error ? 'is-danger' : ''}`} onChange={onChange} {...props} />
    {error && <p className="help is-danger">{error}</p>}
    {icons}
  </div>
);

export default Input;
