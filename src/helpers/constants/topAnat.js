// eslint-disable-next-line import/prefer-default-export
import classnames from '../classnames';

export const TOP_ANAT_DEFAULT_RP = {
  fg: null,
  bg: null,
  customBg: false,
};
export const TOP_ANAT_FORM_CONFIG = {
  initialValue: {
    genes: '',
    genesBg: '',
    email: '',
    jobDescription: '',
    stages: 'all',
    dataQuality: 'all',
    decorrelationType: 'classic',
    nodeSize: '20',
    nbNode: '20',
    fdrThreshold: '0.2',
    pValueThreshold: '1',
    rnaSeq: true,
    full: true,
    affymetrix: true,
    inSitu: true,
    est: true,
  },
  validations: {
    genes: {
      required: {
        value: true,
        message: 'The job needs to run with some genes.',
      },
    },
    email: {
      nodeSize: {
        required: {
          value: true,
          message: 'Please choose a node size (ex: 20)',
        },
      },
      nbNode: {
        required: {
          value: true,
          message: 'Please choose a number of nodes (ex: 20)',
        },
      },
      fdrThreshold: {
        required: {
          value: true,
          message: 'Please choose a FDR threshold (ex: 0.2)',
        },
      },
      pValueThreshold: {
        required: {
          value: true,
          message: 'Please choose a p-value threshold (ex: 1)',
        },
      },
    },
  },
};

export const TOP_ANAT_DEFAULT_VALUES = {
  stages: 'all',
  dataQuality: 'all',
  decorrelationType: 'classic',
  nodeSize: '20',
  nbNode: '20',
  fdrThreshold: '0.2',
  pValueThreshold: '1',
};
export const topAnatAdvancedOptsNotDefault = opts => {
  let isNotDefault = false;
  Object.entries(TOP_ANAT_DEFAULT_VALUES).forEach(([opt, value]) => {
    if (
      (['stages', 'dataQuality', 'decorrelationType'].includes(opt) && opts[opt] !== value) ||
      (!['stages', 'dataQuality', 'decorrelationType'].includes(opt) && parseFloat(opts[opt]) !== parseFloat(value))
    ) {
      isNotDefault = true;
    }
  });
  return isNotDefault;
};

export const topAnatLabelClassNames = (key, value) => {
  if (['stages', 'dataQuality', 'decorrelationType'].includes(key)) {
    return classnames('label', 'is-relative', {
      'not-default': TOP_ANAT_DEFAULT_VALUES[key] !== value,
    });
  }
  return classnames('label', 'is-relative', {
    'not-default': parseFloat(TOP_ANAT_DEFAULT_VALUES[key]) !== parseFloat(value),
  });
};
