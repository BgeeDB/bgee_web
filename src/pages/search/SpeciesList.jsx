import PATHS from '~/paths/paths';
import Bulma from '~/components/Bulma';
import api from '~/api';
import GridSpecies from '~/components/GridSpecies/GridSpecies';
import config from '~/config.json';
import { getMetadata } from '~/helpers/metadata';

export async function loader() {
  try {
    const speciesRes = await api.search.species.list();
    return { speciesList: speciesRes.data.species };
  } catch (error) {
    // console.warn(error)
    throw new Response(error.data.message || 'Failed to load species data', { status: 404 });
  }
}

export function meta({ data }) {
  return getMetadata({
    title: 'Bgee Species list',
    description: 'List of species with expression data available in Bgee',
    keywords: data.speciesList.map((s) => `${s.genus} ${s.speciesName} ${s.name ? `, ${s.name}` : ''}`).join(', '),
    link: `${config.genericDomain}${PATHS.SEARCH.SPECIES}`,
  });
}

const SpeciesList = ({ loaderData }) => {
  const { speciesList } = loaderData;

  return (
    <>
      <div className="content has-text-centered">
        <Bulma.Title size={3}>Bgee species list</Bulma.Title>
      </div>
      <div className="content">
        <div className="grid-species">
          <GridSpecies
            speciesList={speciesList}
            to={(species) => PATHS.SEARCH.SPECIES_ITEM.replace(':id', species.id)}
          />
        </div>
      </div>
      <Bulma.Section>
        <Bulma.Columns>
          <Bulma.C size={12} className="has-text-centered">
            <CreativeCommons />
          </Bulma.C>
        </Bulma.Columns>
      </Bulma.Section>
    </>
  );
};

export default SpeciesList;
