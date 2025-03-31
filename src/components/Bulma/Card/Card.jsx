import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';
import CardBody from './CardBody';
import CardHeader from './CardHeader';
import CardFooter from './CardFooter';
import CardImage from './CardImage';

const Card = ({ className, children, ...props }) => (
  <Element className={classnames('card', className)} {...props}>
    {children}
  </Element>
);

Card.Image = CardImage;
Card.Body = CardBody;
Card.Header = CardHeader;
Card.Footer = CardFooter;

Card.propTypes = {};

Card.defaultProps = {};

export default Card;
