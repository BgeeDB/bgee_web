import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const MediaItem = ({ children, className, align, ...props }) => {
  const p = align === 'center' ? 'content' : align;
  return (
    <Element
      {...props}
      className={classnames(className, {
        [`media-${p}`]: p,
      })}
    >
      {children}
    </Element>
  );
};

MediaItem.defaultProps = {
  align: 'center',
};

export default MediaItem;
