import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';
import Image from '../Image/Image';

const CardImage = ({
  className,
  domRef,
  ...props
}: {
  className?: string;
  domRef?: React.Ref<HTMLDivElement>;
  [key: string]: any;
}) => (
  <Element domRef={domRef} className={classnames('card-image', className)}>
    <Image {...props} />
  </Element>
);

CardImage.propTypes = {};

CardImage.defaultProps = {};

export default CardImage;
