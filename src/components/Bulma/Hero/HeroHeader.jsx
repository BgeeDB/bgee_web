import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const HeroHeader = ({ className, renderAs = 'header', ...props }) => (
  <Element {...props} renderAs={renderAs} className={classnames(className, 'hero-head')} />
);

export default HeroHeader;
