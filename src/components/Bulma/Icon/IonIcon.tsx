import Icon from './Icon';

const IonIcon = ({ name, size, ...props }: any) => (
  <Icon {...props}>
    <ion-icon name={name} size={size} />
  </Icon>
);

export default IonIcon;
