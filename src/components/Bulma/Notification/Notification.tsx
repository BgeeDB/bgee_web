import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const Notification = ({
  className,
  color,
  light,
  ...props
}: {
  className?: string;
  color?: string;
  light?: boolean;
  [key: string]: any;
}) => (
  <Element
    {...props}
    className={classnames(
      'notification',
      {
        [`is-${color}`]: color,
        'is-light': light,
      },
      className
    )}
  />
);

export default Notification;
