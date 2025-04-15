import React from 'react';
import api from '../api';

const useGeneSearch = () => {
  const [resResultListGenes, setResResultListGenes]: any = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);

  const searchResultHandler = React.useCallback((val: string) => {
    if (val !== '') {
      setIsLoading(true);
      api.search.genes
        .geneSearchResult(val)
        .then((resp: any) => {
          if (resp.code === 200) {
            setResResultListGenes(resp.data.result);
          } else {
            setResResultListGenes(null);
          }
        })
        .catch(() => {
          setResResultListGenes(undefined);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setResResultListGenes(null);
    }
  }, []);

  return {
    resResultListGenes,
    searchResultHandler,
    setResults: setResResultListGenes,
    isLoading,
  };
};

export default useGeneSearch;
