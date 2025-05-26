import { useEffect, useState } from 'react';
import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const Image = ({
  className,
  alt,
  size,
  fallback,
  rounded,
  src,
  fullwidth,
  width,
  height,
  imgClassnames,
  ...props
}) => {
  const [state, setState] = useState({ src });
  useEffect(() => {
    setState({ src });
  }, [src]);
  let s = size;

  if (typeof size === 'number') {
    s = `${s}x${s}`;
  }
  return (
    <Element
      {...props}
      className={classnames('image', className, {
        [`is-${s}`]: s,
        'is-fullwidth': fullwidth,
      })}
    >
      <img
        className={classnames(
          {
            'is-rounded': rounded,
          },
          imgClassnames
        )}
        onError={() => state.src !== fallback && setState({ src: fallback })}
        src={state.src}
        alt={alt}
        style={{ width, height }}
      />
    </Element>
  );
};

Image.defaultProps = {
  renderAs: 'figure',
};

export default Image;
