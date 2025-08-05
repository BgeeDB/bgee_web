import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';
import MediaItem from './MediaItem';

const Media = ({
  children,
  className,
  renderAs = 'article',
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  renderAs?: string;
  [key: string]: any;
}) => (
  <Element {...props} renderAs={renderAs} className={classnames('media', className, {})}>
    {children}
  </Element>
);

Media.Item = MediaItem;

export default Media;
