import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const CardBody = ({ className, ...props }) => (
  <Element {...props} className={classnames('card-content', className)} />
);

CardBody.propTypes = {};

CardBody.defaultProps = {};

export default CardBody;
