import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const MessageBody = ({ children, className, ...props }) => (
  <Element {...props} className={classnames('message-body', className)}>
    {children}
  </Element>
);

MessageBody.propTypes = {};

export default MessageBody;
