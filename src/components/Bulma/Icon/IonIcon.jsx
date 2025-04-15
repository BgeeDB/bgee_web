import Icon from './Icon';

const IonIcon = ({ name, size = undefined, ...props }) => (
  <Icon {...props}>
    <ion-icon name={name} size={size} />
  </Icon>
);

export default IonIcon;
