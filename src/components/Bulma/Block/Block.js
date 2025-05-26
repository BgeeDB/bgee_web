import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const Block = ({ className, ...props }) => (
  <Element {...props} className={classnames('block', className)} />
);

Block.propTypes = {};

Block.defaultProps = {};

export default Block;
