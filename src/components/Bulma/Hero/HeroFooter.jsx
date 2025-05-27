import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const HeroFooter = ({ className, renderAs = 'footer', ...props }) => (
  <Element {...props} renderAs={renderAs} className={classnames(className, 'hero-foot')} />
);

export default HeroFooter;
