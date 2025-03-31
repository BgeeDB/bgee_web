import classnames from '../../helpers/classnames';

const Tooltip = ({
  children,
  title,
  content,
  style,
  className,
  isLeft = false,
}) => (
  <div className={classnames('tooltip', className)} style={style}>
    {children}
    <span className={classnames('tooltip-content', isLeft && 'isLeft')}>
      {title && (
        <div className="tooltip-header">
          <p className="has-text-weight-semibold is-size-7 has-text-dark">
            {title}
          </p>
        </div>
      )}
      <div className="tooltip-body">
        <span className="is-size-7 has-text-weight-normal">{content}</span>
      </div>
    </span>
  </div>
);

export default Tooltip;
