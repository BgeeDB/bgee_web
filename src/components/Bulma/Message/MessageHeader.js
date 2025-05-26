import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const MessageHeader = ({ children, className, ...props }) => (
  <Element {...props} className={classnames('message-header', className)}>
    {children}
  </Element>
);

MessageHeader.propTypes = {};

export default MessageHeader;
