import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';
import HeroHeader from './HeroHeader';
import HeroBody from './HeroBody';
import HeroFooter from './HeroFooter';

const Hero = ({
  children,
  className = '',
  color = undefined,
  gradient = false,
  size = undefined,
  hasNavbar = false,
  renderAs = 'section',
  ...props
}) => (
  <Element
    renderAs={renderAs}
    {...props}
    className={classnames('hero', className, {
      [`is-${color}`]: color,
      [`is-${size}`]: size && !hasNavbar,
      'is-bold': gradient,
      'is-fullheight-with-navbar': hasNavbar,
    })}
  >
    {children}
  </Element>
);

Hero.Header = HeroHeader;
Hero.Body = HeroBody;
Hero.Footer = HeroFooter;

export default Hero;
