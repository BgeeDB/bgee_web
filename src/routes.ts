import { type RouteConfig, index, route } from '@react-router/dev/routes';
import { flatRoutes } from '@react-router/fs-routes';
import PATHS from './paths/paths';

// https://reactrouter.com/start/framework/routing
export default [
  index('./pages/Home.jsx'),

  // Analysis routes
  route(PATHS.ANALYSIS.TOP_ANAT + '/:id?/:jobId?', './pages/analysis/TopAnat.jsx'),
  route(PATHS.ANALYSIS.EXPRESSION_COMPARISON, './pages/analysis/ExpComp.jsx'),

  // Search routes (gene resolution is in the routes/ folder)
  route(PATHS.SEARCH.GENE, './pages/search/GeneList.tsx'),
  route(PATHS.SEARCH.ANATOMICAL_HOMOLOGY, './pages/search/AnatomicalHomologySearch.jsx'),
  route(PATHS.SEARCH.SPECIES, './pages/search/SpeciesList.jsx'),
  route(PATHS.SEARCH.SPECIES_ITEM, './pages/search/Species.jsx'),
  route(PATHS.SEARCH.GENE_LIST_ITEM + '/:speciesName?', './pages/search/SpeciesGeneList.jsx'),
  route(PATHS.SEARCH.RAW_DATA_ANNOTATIONS, './pages/search/rawdata/RawDataAnnotations.jsx'),
  route(PATHS.SEARCH.EXPRESSION_CALLS, './pages/search/rawdata/ExpressionCalls.tsx'),
  route(PATHS.SEARCH.EXPRESSION_MATRIX, './pages/search/expressionmatrix/GeneExpressionMatrix.jsx'),
  route(PATHS.SEARCH.EXPERIMENT, './pages/search/experiments/Experiment/Experiment.jsx'),

  // Download routes
  route(PATHS.DOWNLOAD.GENE_EXPRESSION_CALLS, './pages/download/GeneExpressionCalls.jsx'),
  route(PATHS.DOWNLOAD.PROCESSED_EXPRESSION_VALUES, './pages/download/ProcessedExpressionValues.jsx'),
  route(PATHS.DOWNLOAD.DATA_DUMPS, './pages/download/DataDumps.jsx'),

  // Resources routes
  route(PATHS.RESOURCES.R_PACKAGES, './static/resources/rPackage.js'),
  route(PATHS.RESOURCES.ANNOTATIONS, './static/resources/annotations.js'),
  route(PATHS.RESOURCES.ONTOLOGIES, './static/resources/ontologies.js'),
  route(PATHS.RESOURCES.SOURCE_CODE, './static/resources/source.js'),

  // Support routes (most are in the routes folder)
  route(PATHS.SUPPORT.TUTORIALS, './static/support/Tutorials.js'),
  route(PATHS.SUPPORT.VIDEOS, './static/support/videos.js'),

  // About routes
  route(PATHS.ABOUT.NEWS, './pages/about/NewsPage.tsx'),
  route(PATHS.ABOUT.SOURCES, './pages/about/DataSource.jsx'),
  route(PATHS.ABOUT.ABOUT, './static/about/about.js'),
  route(PATHS.ABOUT.COLLABORATIONS, './static/about/collaborations.js'),
  route(PATHS.ABOUT.PUBLICATION, './static/about/publications.js'),
  route(PATHS.ABOUT.TEAM, './static/about/team.js'),
  route(PATHS.ABOUT.BGEESAB, './static/about/bgeesab.js'),
  route(PATHS.ABOUT.PRIVACY_POLICY, './static/about/privacyPolicy.js'),

  // https://reactrouter.com/how-to/file-route-conventions
  ...(await flatRoutes()),
] satisfies RouteConfig;
