import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const HeroBody = ({ className, ...props }) => (
  <Element {...props} className={classnames(className, 'hero-body')} />
);

HeroBody.defaultProps = {
  renderAs: 'div',
};

export default HeroBody;
