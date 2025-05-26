import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const Box = ({ children, className, ...props }) => (
  <Element {...props} className={classnames('box', className)}>
    {children}
  </Element>
);

Box.propTypes = {};

Box.defaultProps = {};

export default Box;
