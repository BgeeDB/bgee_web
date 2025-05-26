import useBulmaElementClassNames from '../../../hooks/bulma/useBulmaElementClassNames';
import classnames from '../../../helpers/classnames';

const Element = ({ className, renderAs, domRef, children, ...allProps }) => {
  const RenderAs = renderAs;
  const [classNames, props] = useBulmaElementClassNames(allProps);
  return (
    <RenderAs
      ref={domRef}
      className={classnames(className, classNames) || undefined}
      {...props}
    >
      {children}
    </RenderAs>
  );
};

Element.defaultProps = {
  renderAs: 'div',
};

export default Element;
