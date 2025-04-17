import { CircleHelp, Info } from 'lucide-react';
import Tooltip from '../Tooltip';

const HelpIcon = ({ title, content, style, className = undefined, isLeft = false, iconName = 'help-circle' }) => (
  <Tooltip title={title} content={content} style={style} className={className} isLeft={isLeft}>
    <span className="icon is-clickable">
      {iconName === 'info' ? <Info /> : <CircleHelp color="white" fill="black" size={20} />}
    </span>
  </Tooltip>
);

export default HelpIcon;
