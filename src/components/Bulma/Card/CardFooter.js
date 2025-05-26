import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const CardFooterItem = ({ className, ...props }) => (
  <Element {...props} className={classnames('card-footer-item', className)} />
);

CardFooterItem.propTypes = {};

CardFooterItem.defaultProps = {};

const CardFooter = ({ className, ...props }) => (
  <Element {...props} className={classnames('card-footer', className)} />
);

CardFooter.Item = CardFooterItem;

CardFooter.propTypes = {};

CardFooter.defaultProps = {};

export default CardFooter;
