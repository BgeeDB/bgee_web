import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';
import MediaItem from './MediaItem';

const Media = ({ children, className, ...props }) => (
  <Element {...props} className={classnames('media', className, {})}>
    {children}
  </Element>
);

Media.Item = MediaItem;

Media.defaultProps = {
  renderAs: 'article',
};

export default Media;
