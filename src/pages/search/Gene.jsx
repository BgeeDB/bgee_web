import React from 'react';
import { useNavigate, useParams } from 'react-router';
import PATHS from '../../paths/paths';
import api from '../../api';
import GeneDetails from '../../components/Gene/GeneDetails';
import GeneList from '../../components/Gene/GeneList';

const FLOW = {
  LOADING: 'loading',
  LOADED: 'loaded',
};

const Gene = () => {
  const navigate = useNavigate();
  const { geneId, speciesId: urlSpeciesId } = useParams();

  const [flowState, setFlowState] = React.useState(FLOW.LOADING);
  const [geneDetails, setGeneDetails] = React.useState();

  React.useEffect(() => {
    setFlowState(FLOW.LOADING);
    api.search.genes
      .getGeneralInformation(geneId)
      .then(({ data }) => {
        if (data.genes.length === 1 && urlSpeciesId) {
          navigate(PATHS.SEARCH.GENE_ITEM.replace(':geneId', geneId));
        } else {
          setGeneDetails(data.genes);
          setFlowState(FLOW.LOADED);
        }
      })
      .catch((err) => {
        console.log(err.message);
        navigate(PATHS.ERROR, {
          error: {
            message: err.message || err?.data?.code,
          },
        });
      });
  }, [geneId, urlSpeciesId]);

  if (flowState === FLOW.LOADING) return null;

  if (
    (!urlSpeciesId && geneDetails?.length === 1) ||
    (urlSpeciesId &&
      geneDetails?.length > 1 &&
      geneDetails?.find((g) => g.species.id === urlSpeciesId))
  ) {
    return (
      <GeneDetails
        details={
          geneDetails.length === 1
            ? geneDetails[0]
            : geneDetails?.find((g) => g.species.id === urlSpeciesId)
        }
      />
    );
  }

  if (!urlSpeciesId && geneDetails?.length > 1) {
    return <GeneList details={geneDetails} navigate={navigate} />;
  }
  return null;
};

export default Gene;
