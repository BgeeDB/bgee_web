import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const HeroHeader = ({ className, ...props }) => (
  <Element {...props} className={classnames(className, 'hero-head')} />
);

HeroHeader.defaultProps = {
  renderAs: 'header',
};

export default HeroHeader;
