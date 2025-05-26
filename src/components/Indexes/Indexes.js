import {Link} from "react-router-dom";
import Bulma from "../Bulma";
import PATHS from "../../routes/paths";

const Indexes = ({ speciesList }) => (<>
    <Bulma.Card.Header>
      <Bulma.Card.Header.Title className="is-size-3 has-text-primary">
        Bgee gene expression database indexes
      </Bulma.Card.Header.Title>
    </Bulma.Card.Header>
    <Bulma.Card.Body>
      <Bulma.Columns >
        {speciesList && speciesList.map((species) => (
          <Bulma.C key={`${species.id}-indexes`} className="p-0 is-one-quarter-fullhd is-one-third-desktop is-half-tablet is-full-mobile">
            <i>{`${species.genus} ${species.speciesName} `}</i>
            <Link className="internal-link"
                  to={PATHS.SEARCH.GENE_LIST_ITEM_BY_SPECIES
                      .replace(':speciesId', species.id)
                      .replace(':speciesName', species.speciesFullNameWithoutSpace?.replace("_", "-").toLowerCase())}
                  title={`Gene list for species ${species.genus} ${species.speciesName}`}>
                Genes
            </Link>
            &nbsp;-&nbsp;
            <Link className="internal-link"
                  to={`${PATHS.SEARCH.RAW_DATA_ANNOTATIONS}?species_id=${species.id}`}
                  title={`Experiment list for species ${species.genus} ${species.speciesName}`}>
                Experiments
            </Link>
          </Bulma.C>)
        )}
      </Bulma.Columns>
    </Bulma.Card.Body>
</>);

export default Indexes;

