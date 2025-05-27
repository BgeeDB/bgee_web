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
  renderAs = 'figure',
  ...props
}: {
  className?: string;
  alt?: string;
  size?: string | number;
  fallback?: string;
  rounded?: boolean;
  src?: string;
  fullwidth?: boolean;
  width?: number | string;
  height?: number | string;
  imgClassnames?: string;
  renderAs?: any;
  [key: string]: any;
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
      renderAs={renderAs}
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
        onError={() => fallback && state.src !== fallback && setState({ src: fallback })}
        src={state.src}
        alt={alt}
        style={{ width, height }}
      />
    </Element>
  );
};

export default Image;
