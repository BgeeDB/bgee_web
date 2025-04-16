import isPlural from './isPlural';
import config from '../config.json';

const { ID_FULL_LENGTH } = config.dataTypeIds;

const ApiReducer = {
  topAnatForm: (rp) => (prev) => ({
    ...prev,
    genes: rp.fg_list.join('\n'),
    genesBg: (rp.bg_list || []).join('\n'),
    email: '',
    jobDescription: rp.job_title || '',
    stages: rp.stage_Id || 'all',
    dataQuality: rp.data_qual,
    decorrelationType: rp.decorr_type,
    nodeSize: rp.node_size || '',
    nbNode: rp.nb_node || '',
    fdrThreshold: rp.fdr_thr || '',
    pValueThreshold: rp.p_value_thr || '',
    rnaSeq: Boolean(rp.data_type.find((f) => f === 'RNA_SEQ')),
    full: Boolean(rp.data_type.find((f) => f === ID_FULL_LENGTH)),
    affymetrix: Boolean(rp.data_type.find((f) => f === 'AFFYMETRIX')),
    inSitu: Boolean(rp.data_type.find((f) => f === 'IN_SITU')),
    est: Boolean(rp.data_type.find((f) => f === 'EST')),
  }),
  topAnatRequestParameters: (res, rp) => (prev) => {
    const curr = JSON.parse(JSON.stringify(prev));

    curr.fg = {
      list: res.data.fg_list,
      message: `${rp.fg_list.length} IDs provided, ${
        res.data.fg_list.geneCount[res.data.fg_list.selectedSpecies]
      } unique ${isPlural('gene', res.data.fg_list.geneCount[res.data.fg_list.selectedSpecies])} found in ${
        res.data.fg_list.detectedSpecies[res.data.fg_list.selectedSpecies].name
      }`,
    };
    if (rp.bg_list) curr.customBg = true;
    if (res.data.bg_list)
      curr.bg = res.data.bg_list
        ? {
            list: res.data.bg_list,
            message: `${rp.bg_list.length} IDs provided, ${
              res.data.bg_list.geneCount[res.data.bg_list.selectedSpecies]
            } unique ${isPlural('gene', res.data.bg_list.geneCount[res.data.bg_list.selectedSpecies])} found in ${
              res.data.bg_list.detectedSpecies[res.data.bg_list.selectedSpecies].name
            }`,
          }
        : null;
    return curr;
  },
};

export default ApiReducer;
