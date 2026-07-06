import React from 'react';
import { Link } from 'react-router';

import Bulma from '~/components/Bulma';
import SpeciesAnatomyHeatmap from '~/components/SpeciesAnatomyHeatmap/SpeciesAnatomyHeatmap';
import PATHS from '~/paths/paths';
import config from '~/config.json';
import imagePath from '~/helpers/imagePath';
import { getMetadata } from '~/helpers/metadata';

const HEATMAP_SVG = imagePath('/browse/bgee-integrated-libs.svg');

export function meta() {
  return getMetadata({
    title: 'Species ⨯ anatomy overview',
    description:
      'Overview heatmap of bulk and single-cell RNA-seq libraries integrated in Bgee, by species and anatomical entity.',
    keywords: 'species, anatomy, RNA-seq, scRNA-seq, libraries, heatmap, integrated data',
    link: `${config.genericDomain}${PATHS.SEARCH.SPECIES_ANATOMY_OVERVIEW}`,
  });
}

const SpeciesAnatomyOverview = () => (
  <>
    <div className="content has-text-centered">
      <Bulma.Title size={3}>Species ⨯ anatomy overview</Bulma.Title>
    </div>

    <Bulma.Section>
      <div className="content species-anatomy-overview">
        <p>
          This page provides an overview of all bulk and single-cell RNA-seq datasets integrated in Bgee. The heatmap
          below summarizes how many sequencing libraries are available for each combination of species (rows) and
          anatomical entity (columns).
        </p>
        <p>
          Each cell displays the number of libraries available for that species and anatomical entity. Cell background
          color reflects the library count, as shown in the legend (from fewer than 5 libraries in red to 100 or more in
          green). Clicking a cell opens the corresponding curated annotations in Bgee, filtered by species and anatomy.
          Clicking a species name on the left shows all integrated data for that species. Drag the heatmap to
          pan, and use the zoom controls, mouse wheel, or pinch gestures to magnify it on smaller screens.
        </p>
        <p>
          The heatmap is updated with each Bgee update to reflect newly integrated data.
        </p>

        <SpeciesAnatomyHeatmap
          src={HEATMAP_SVG}
          title="Bgee integrated libraries by species and anatomical entity"
        />

        <p className="has-text-centered mt-4">
          <Link to={PATHS.SEARCH.RAW_DATA_ANNOTATIONS} className="internal-link">
            Browse all curated annotations
          </Link>
          {' · '}
          <Link to={PATHS.SEARCH.SPECIES} className="internal-link">
            Browse species
          </Link>
        </p>
      </div>
    </Bulma.Section>
  </>
);

export default SpeciesAnatomyOverview;
