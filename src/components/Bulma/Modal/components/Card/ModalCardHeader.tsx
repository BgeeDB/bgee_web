import Element from '../../../Element/Element';
import classnames from '../../../../../helpers/classnames';

const ModalCardHeader = ({
  children,
  className,
  renderAs = 'header',
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  renderAs?: string;
  [key: string]: any;
}) => (
  <Element {...props} renderAs={renderAs} className={classnames('modal-card-head', className)}>
    {children}
  </Element>
);

export default ModalCardHeader;
