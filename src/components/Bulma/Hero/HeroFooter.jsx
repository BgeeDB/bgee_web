import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const HeroFooter = ({ className, ...props }) => (
  <Element {...props} className={classnames(className, 'hero-foot')} />
);

HeroFooter.defaultProps = {
  renderAs: 'footer',
};

export default HeroFooter;
