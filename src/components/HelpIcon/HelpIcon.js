import Tooltip from '../Tooltip';

const HelpIcon = ({
  title,
  content,
  style,
  className,
  isLeft = false,
  iconName = 'help-circle',
}) => (
  <Tooltip
    title={title}
    content={content}
    style={style}
    className={className}
    isLeft={isLeft}
  >
    <span className="icon is-clickable">
      <ion-icon name={iconName} size="large" />
    </span>
  </Tooltip>
);

export default HelpIcon;
