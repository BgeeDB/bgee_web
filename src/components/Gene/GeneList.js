import { Helmet } from 'react-helmet';
import Bulma from '../Bulma';
import PATHS from '../../routes/paths';
import classnames from '../../helpers/classnames';
import imagePath from '../../helpers/imagePath';

const GeneList = ({ details, history }) => (
  <>
    <Helmet>
      <title>{`Gene ${details[0].name} ${details[0].geneId}`}</title>
    </Helmet>
    <div className="content has-text-centered mb-6">
      <p className="title is-5">Gene search</p>
    </div>
    <p>
      The search gene ID is found in several species. Select the desired gene:
    </p>
    <div className="is-flex is-justify-content-center">
      {details.map((e) => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <div
          key={e.species.id}
          onClick={() => {
            history.push(
              PATHS.SEARCH.GENE_ITEM_BY_SPECIES.replace(
                ':geneId',
                e.geneId
              ).replace(':speciesId', e.species.id).replace(/\/$/, '')
            );
          }}
        >
          <Bulma.Card
            className={classnames(
              'is-flex',
              'is-align-items-center',
              'mt-3',
              'gene-species'
            )}
          >
            <Bulma.Image
              className="mr-2"
              src={imagePath(`/species/${e.species.id}_light.jpg`)}
              height={100}
              width={100}
            />
            <p>
              {`${e.name} - ${e.geneId} in `}
              <i>{`${e.species.genus} ${e.species.speciesName}`}</i>
              {` (${e.species.name})`}
            </p>
          </Bulma.Card>
        </div>
      ))}
    </div>
  </>
);

export default GeneList;
