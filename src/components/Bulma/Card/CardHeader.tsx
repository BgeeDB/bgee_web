import Element from '../Element/Element';
import classnames from '../../../helpers/classnames';

const CardHeaderIcon = ({ className, ...props }: any) => (
  <Element {...props} className={classnames('card-header-icon', className)} />
);

CardHeaderIcon.propTypes = {};

CardHeaderIcon.defaultProps = {};

const CardHeaderTitle = ({ className, ...props }: any) => (
  <Element {...props} className={classnames('card-header-title', className)} />
);

CardHeaderTitle.propTypes = {};

CardHeaderTitle.defaultProps = {};

const CardHeader = ({ className, ...props }: any) => (
  <Element {...props} className={classnames('card-header', className)} />
);

CardHeader.Title = CardHeaderTitle;

CardHeader.Icon = CardHeaderIcon;

export default CardHeader;
