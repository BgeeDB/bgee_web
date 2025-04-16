import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const CardBody = ({ className, ...props }: { className?: string; [key: string]: any }) => (
  <Element {...props} className={classnames('card-content', className)} />
);

CardBody.propTypes = {};

CardBody.defaultProps = {};

export default CardBody;
