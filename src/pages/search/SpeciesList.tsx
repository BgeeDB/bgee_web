import React from 'react';
import PATHS from '~/paths/paths';
import Bulma from '~/components/Bulma';
import { useLocation, useNavigate } from 'react-router';
import api from '~/api';
import GridSpecies from '~/components/GridSpecies/GridSpecies';
import CreativeCommons from '~/components/CreativeCommons/CreativeCommons';
import ExpressionSearch from '../../components/Search/ExpressionSearch';
import expressionPageHelper from '../../helpers/expressionPageHelper';
import config from '~/config.json';
import { getMetadata } from '~/helpers/metadata';

export async function loader() {
  try {
    const speciesRes = await api.search.species.list();
    const kwList = speciesRes.data.species.reduce((acc, group) => {
      acc[group.id] = [group.id.toString(), group.genus, group.speciesName, group.name];
      return acc;
    }, {});
    /* FIXME speciesList may not have the right structure + maybe check if group.name is empty */
    return { speciesList: speciesRes.data.species, kwList };
  } catch (error: any) {
    // console.warn(error)
    throw new Response(error.data?.message || error.message || 'Failed to load species data', { status: 404 });
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
  const { speciesList, kwList } = loaderData;
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = React.useState('');
  const filteredSpecies = React.useMemo(() => {
    const tmp = JSON.parse(JSON.stringify(speciesList));
    if (search === '') return tmp;
    const regExp = new RegExp(search, 'i');
    return tmp.filter(({ id }) => (!kwList[id] ? false : Boolean(kwList[id].find((a) => regExp.test(a)))));
  }, [speciesList, search, kwList]);

  return (
    <>
      <div className="content has-text-centered">
        <Bulma.Title size={3}>Bgee species list</Bulma.Title>
      </div>
      <Bulma.Card className="form search-input mx-auto my-3">
        <Bulma.Card.Body>
          <div className="content">
            <div className="field">
              <label className="label" htmlFor="search-species">
                Search species
              </label>
              <ExpressionSearch
                search={search}
                setSearch={setSearch}
                elements={expressionPageHelper.autocompleteSpecies(filteredSpecies, kwList, search)}
                onRender={expressionPageHelper.autocompleteSpeciesRender(setSearch, navigate, location)}
              />
            </div>
          </div>
        </Bulma.Card.Body>
      </Bulma.Card>
      <div className="content">
        <div className="grid-species">
          <GridSpecies
            speciesList={filteredSpecies}
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
