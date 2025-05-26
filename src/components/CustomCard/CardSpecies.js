import Bulma from '../Bulma';
import imagePath from '../../helpers/imagePath';

const CardSpecies = ({ genus, speciesName, name, id }) => (
  <Bulma.Card className="species">
    <Bulma.Card.Image
      className="auto-center-100"
      src={imagePath(`/species/${id}_light.jpg`)}
      alt={`species ${genus} ${speciesName}- ${name}`}
      fallback="https://via.placeholder.com/100"
      height={100}
      width={100}
    />
    <Bulma.Card.Body className="py-2 px-1">
      <Bulma.Media>
        <Bulma.Media.Item>
          <p className="subtitle is-7 has-text-centered mb-1 is-italic">
            {`${genus[0]}. ${speciesName}`}
          </p>
          <p className="subtitle is-7 has-text-centered">{name}</p>
        </Bulma.Media.Item>
      </Bulma.Media>
    </Bulma.Card.Body>
  </Bulma.Card>
);

export default CardSpecies;
