import Bulma from '../Bulma';

const GoTop = () => (
  <Bulma.Button
    onClick={() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }}
    color="primary"
    outlined
    type="button"
    className="go-top"
  >
    <span className="icon">
      <ion-icon name="chevron-up-outline" />
    </span>
  </Bulma.Button>
);

export default GoTop;
