import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const Container = ({ children, max, breakpoint, className, ...props }) => {
  const canSetMax = ['desktop', 'widescreen'].includes(breakpoint);
  return (
    <Element
      {...props}
      className={classnames('container', className, {
        [`is-${canSetMax && max ? 'max-' : ''}${breakpoint}`]: breakpoint,
      })}
    >
      {children}
    </Element>
  );
};

Container.defaultProps = {};

export default Container;
