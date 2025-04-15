import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const MediaItem = ({ children, className, align = 'center', ...props }) => {
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

export default MediaItem;
