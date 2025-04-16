import useBulmaElementClassNames from '~/hooks/bulma/useBulmaElementClassNames';
import classnames from '~/helpers/classnames';

const Element = ({
  className,
  renderAs = 'div',
  domRef,
  children,
  ...allProps
}: {
  className?: string;
  renderAs?: any;
  domRef?: React.Ref<any>;
  children?: React.ReactNode;
  [x: string]: any;
}) => {
  const RenderAs = renderAs;
  const [classNames, props] = useBulmaElementClassNames(allProps);
  // const safeProps = typeof props === 'object' && props !== null ? props : {};
  return (
    <RenderAs ref={domRef} className={classnames(className, classNames) || undefined} {...props}>
      {children}
    </RenderAs>
  );
};

export default Element;
