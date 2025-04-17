import Bulma from '../Bulma';
import { ChevronUp } from 'lucide-react';

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
      <ChevronUp />
    </span>
  </Bulma.Button>
);

export default GoTop;
