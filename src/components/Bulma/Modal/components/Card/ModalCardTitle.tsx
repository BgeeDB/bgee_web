import Element from '../../../Element/Element';
import classnames from '../../../../../helpers/classnames';

const ModalCardTitle = ({
  children,
  className,
  renderAs = 'p',
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  renderAs?: string;
  [key: string]: any;
}) => (
  <Element {...props} renderAs={renderAs} className={classnames('modal-card-title', className)}>
    {children}
  </Element>
);

export default ModalCardTitle;
