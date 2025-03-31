import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';
import HeroHeader from './HeroHeader';
import HeroBody from './HeroBody';
import HeroFooter from './HeroFooter';

const Hero = ({
  children,
  className,
  color,
  gradient,
  size,
  hasNavbar,
  ...props
}) => (
  <Element
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

Hero.defaultProps = {
  renderAs: 'section',
};

export default Hero;
