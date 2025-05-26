import config from '../config.json';

const APP_VERSION = config.version;
const URL_VERSION = APP_VERSION.replaceAll('.', '-');
const URL_ROOT = `${config.archive ? `/${URL_VERSION}` : ''}`;
const SPARQL_ARCH = `${config.archive ? `${URL_VERSION}` : ''}`;
const PATHS = {
  HOME: `${URL_ROOT}/`,
  ANALYSIS: {
    TOP_ANAT: `${URL_ROOT}/analysis/top-anat`,
    TOP_ANAT_RESULT: `${URL_ROOT}/analysis/top-anat/:id`,
    TOP_ANAT_RESULT_JOB_ID: `${URL_ROOT}/analysis/top-anat/:id/:jobId`,
    EXPRESSION_COMPARISON: `${URL_ROOT}/analysis/expr-comparison`,
  },
  SEARCH: {
    GENE: `${URL_ROOT}/search/genes`,
    GENE_ITEM: `${URL_ROOT}/gene/:geneId`,
    GENE_ITEM_BY_SPECIES: `${URL_ROOT}/gene/:geneId/:speciesId`,
    ANATOMICAL_HOMOLOGY: `${URL_ROOT}/search/anatomical-homology`,
    SPARQL: `/sparql${SPARQL_ARCH}/`,
    SPECIES: `${URL_ROOT}/search/species`,
    SPECIES_ITEM: `${URL_ROOT}/species/:id`,
    GENE_LIST_ITEM: `${URL_ROOT}/gene-list/:speciesId`,
    GENE_LIST_ITEM_BY_SPECIES: `${URL_ROOT}/gene-list/:speciesId/:speciesName`,
    RAW_DATA_ANNOTATIONS: `${URL_ROOT}/search/raw-data`,
    EXPRESSION_CALLS: `${URL_ROOT}/search/expression-calls`,
    EXPRESSION_MATRIX: `${URL_ROOT}/search/expression-matrix`,
    EXPERIMENT: `${URL_ROOT}/experiment/:id`
  },
  DOWNLOAD: {
    GENE_EXPRESSION_CALLS: `${URL_ROOT}/download/gene-expression-calls`,
    PROCESSED_EXPRESSION_VALUES: `${URL_ROOT}/download/processed-expression-values`,
    DATA_DUMPS: `${URL_ROOT}/download/data-dumps`,
  },
  RESOURCES: {
    R_PACKAGES: `${URL_ROOT}/resources/r-packages`,
    ANNOTATIONS: `${URL_ROOT}/resources/annotations`,
    ONTOLOGIES: `${URL_ROOT}/resources/ontologies`,
    SOURCE_CODE: `${URL_ROOT}/resources/source-code`,
  },
  SUPPORT: {
    GTEX: `${URL_ROOT}/support/data-sets`,
    TUTORIALS: `${URL_ROOT}/support/tutorials`,
    SCRNASEQPROTOCOLS: `${URL_ROOT}/support/scRNA-seq-protocols-comparison`,
    VIDEOS: `${URL_ROOT}/support/videos`,
    TUTORIAL_GENE_PAGE: `${URL_ROOT}/support/tutorial-gene-page`,
    TUTORIAL_TOPANAT: `${URL_ROOT}/support/tutorial-TopAnat`,
    TUTORIAL_EXPRESSION_CALLS: `${URL_ROOT}/support/tutorial-expression-calls`,
    TUTORIAL_SPARQL: `${URL_ROOT}/support/tutorial-query-bgee-knowledge-graph-sparql`,
    TUTORIAL_CURATION: `${URL_ROOT}/support/tutorial-data-curation`,
    TUTORIAL_EXPRESSION_COMPARISON: `${URL_ROOT}/support/tutorial-expression-comparison`,
    TUTORIAL_RAW_DATA: `${URL_ROOT}/support/tutorial-raw-data`,
    TUTORIAL_ANAT_HOMOLOGY: `${URL_ROOT}/support/tutorial-anatomical-homology`,
    TUTORIAL_AFFY_EXPR_VAL: `${URL_ROOT}/support/tutorial-processed-expression-values-download-affymetrix`,
    TUTORIAL_RNASEQ_EXPR_VAL: `${URL_ROOT}/support/tutorial-processed-expression-values-download-RNA-seq`,
    TUTORIAL_SCRNASEQ_FL_EXPR_VAL: `${URL_ROOT}/support/tutorial-processed-expression-values-download-scRNA-seq-full-length`,
    TUTORIAL_SCRNASEQ_TB_EXPR_VAL: `${URL_ROOT}/support/tutorial-processed-expression-values-download-scRNA-seq-droplet-based`,
    TUTORIAL_EXPR_VAL: `${URL_ROOT}/support/tutorial-processed-expression-values-download-documentation`,
    TUTORIAL_GENE_EXPR: `${URL_ROOT}/support/tutorial-expression-call-download-documentation`,
    FAQ: `${URL_ROOT}/support/faq`,
  },
  ABOUT: {
    ABOUT: `${URL_ROOT}/about/`,
    NEWS: `${URL_ROOT}/about/news`,
    COLLABORATIONS: `${URL_ROOT}/about/collaborations`,
    PUBLICATION: `${URL_ROOT}/about/publications`,
    SOURCES: `${URL_ROOT}/about/sources`,
    TEAM: `${URL_ROOT}/about/team`,
    BGEESAB: `${URL_ROOT}/about/bgeesab`,
    PRIVACY_POLICY: `${URL_ROOT}/about/privacy-policy`,
  },
  ERROR: `${URL_ROOT}/error`,
};

export default PATHS;
