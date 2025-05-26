import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';
import MessageBody from './MessageBody';
import MessageHeader from './MessageHeader';

const Message = ({ children, className, color, size, ...props }) => (
  <Element
    {...props}
    className={classnames('message', className, {
      [`is-${color}`]: color,
      [`is-${size}`]: size,
    })}
  >
    {children}
  </Element>
);

Message.Body = MessageBody;

Message.Header = MessageHeader;

Message.defaultProps = {
  renderAs: 'article',
};

export default Message;
