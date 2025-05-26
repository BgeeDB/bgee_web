/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import PATHS from '../../routes/paths';
import Bulma from '../../components/Bulma';
import CreativeCommons from '../../components/CreativeCommons';
import api from '../../api';
import GridSpecies from '../../components/GridSpecies/GridSpecies';
import config from "../../config.json";

const SpeciesList = () => {
  const [speciesList, setSpeciesList] = useState([]);

  React.useEffect(() => {
    api.search.species.list().then((resp) => {
      if (resp.code === 200) {
        setSpeciesList(resp.data.species);
      } else {
        setSpeciesList([]);
      }
    });
  }, []);

  const metaKeywords = React.useMemo(
    () =>
      speciesList
        .map(
          (s) => `${s.genus} ${s.speciesName} ${s.name ? `, ${s.name}` : ''}`
        )
        .join(', '),
    [speciesList]
  );

  const title = 'Bgee Species list';
  const description = 'List of species with expression data available in Bgee';
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta property='og:title' content={title} />
        <meta name="description" content={description} />
        <meta property='og:description' content={description} />
        <meta name="keywords" content={metaKeywords} />
        <meta property="og:url" content={`${config.genericDomain}${PATHS.SEARCH.SPECIES}`} />
        <link rel="canonical" href={`${config.genericDomain}${PATHS.SEARCH.SPECIES}`} />
      </Helmet>
      <div className="content has-text-centered">
        <Bulma.Title size={3}>Bgee species list</Bulma.Title>
      </div>
      <div className="content">
        <div className="grid-species">
          <GridSpecies
            speciesList={speciesList}
            to={(species) =>
              PATHS.SEARCH.SPECIES_ITEM.replace(':id', species.id)
            }
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
