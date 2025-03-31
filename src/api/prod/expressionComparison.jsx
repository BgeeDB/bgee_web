import axios from 'axios';
import axiosInstance, { getAxiosAddNotif } from './constant';
import errorHandler from '../errorHandler';
import random from '../../helpers/random';

export const EXPRESSION_COMPARISON_API = {
  getResults: null,
};

const DEFAULT_PARAMETERS = (queryBase) => {
  const params = new URLSearchParams(queryBase);
  params.append('page', 'expression_comparison');

  return params;
};

const expressionComparison = {
  getResults: ({ type, data: dataForm }) =>
    new Promise((resolve, reject) => {
      const params = DEFAULT_PARAMETERS(
        type === 'query' ? dataForm : undefined
      );
      if (type === 'query') params.append('display_rp', '1');
      if (type === 'form') params.append('gene_list', dataForm);
      params.append('display_type', 'json');
      axiosInstance
        .get(`/?${params.toString()}`, {
          cancelToken: new axios.CancelToken((c) => {
            EXPRESSION_COMPARISON_API.getResults = c;
          }),
        })
        .then(({ data }) => {
          const formatted = JSON.parse(JSON.stringify(data));
          let speciesAbsent;
          let speciesPresent;
          formatted.data.comparisonResults =
            formatted.data.comparisonResults.map((r) => {
              speciesAbsent = new Set();
              speciesPresent = new Set();
              let filterAnatEntities = '';
              if (r.condition) {
                if (r.condition.cellType)
                  filterAnatEntities = `${r.condition.cellType.name} in `;
                filterAnatEntities += r.condition.anatEntity.name;
              } else if (r.multiSpeciesCondition) {
                if (r.multiSpeciesCondition.cellTypes && r.multiSpeciesCondition.cellTypes.length > 0) {
                  filterAnatEntities = `${r.multiSpeciesCondition.cellTypes
                    .map((a) => a.name)
                    .join(', ')} in `;
                }
                filterAnatEntities += r.multiSpeciesCondition.anatEntities
                  .map((a) => a.name)
                  .join(', ');
              }
              return {
                ...r,
                filterAnatEntities,
                countGenesExprAbsent: r.genesExpressionAbsent.length,
                countGenesExprPresent: r.genesExpressionPresent.length,
                countGenesNoData: r.genesNoData.length,
                countSpeciesExprAbsent: r.genesExpressionAbsent
                  .map((g) => g.species)
                  .filter((el) => {
                    const duplicate = speciesAbsent.has(el.id);
                    speciesAbsent.add(el.id);
                    return !duplicate;
                  }).length,
                countSpeciesExprPresent: r.genesExpressionPresent
                  .map((g) => g.species)
                  .filter((el) => {
                    const duplicate = speciesPresent.has(el.id);
                    speciesPresent.add(el.id);
                    return !duplicate;
                  }).length,
              };
            });
          resolve(formatted);
        })
        .catch((error) => {
          if (
            error?.response?.data?.code === 400 &&
            error?.response?.data?.data?.exceptionType ===
              'JobResultNotFoundException'
          ) {
            getAxiosAddNotif()({
              id: random().toString(),
              children: (
                <p>
                  Results were not present on our server, resubmitting the
                  analysis
                </p>
              ),
              className: `is-warning`,
            });
          } else {
            errorHandler(error);
          }
          reject(error?.response);
        });
    }),
};

export default expressionComparison;
