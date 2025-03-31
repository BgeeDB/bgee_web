import classnames from '../../helpers/classnames';

const LinkExternal = ({ id, to, text, className, children, ...props }) => (
  <a
    href={to}
    target="_blank"
    rel="noopener noreferrer"
    id={id}
    className={classnames('external-link', className)}
    {...props}
  >
    {text || children}
  </a>
);
export default LinkExternal;
