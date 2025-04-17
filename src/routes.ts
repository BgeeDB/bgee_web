import { type RouteConfig, index, route } from '@react-router/dev/routes';
import { flatRoutes } from '@react-router/fs-routes';
import PATHS from './paths/paths';

// https://reactrouter.com/start/framework/routing
export default [
  index('./pages/Home.tsx'),

  // Analysis routes
  route(PATHS.ANALYSIS.TOP_ANAT + '/:id?/:jobId?', './pages/analysis/TopAnat.tsx'),
  route(PATHS.ANALYSIS.EXPRESSION_COMPARISON, './pages/analysis/ExpComp.jsx'),

  // Search routes (gene resolution is in the routes/ folder)
  route(PATHS.SEARCH.GENE, './pages/search/GeneList.tsx'),
  route(PATHS.SEARCH.ANATOMICAL_HOMOLOGY, './pages/search/AnatomicalHomologySearch.tsx'),
  route(PATHS.SEARCH.SPECIES, './pages/search/SpeciesList.tsx'),
  route(PATHS.SEARCH.SPECIES_ITEM, './pages/search/Species.tsx'),
  route(PATHS.SEARCH.GENE_LIST_ITEM + '/:speciesName?', './pages/search/SpeciesGeneList.tsx'),
  route(PATHS.SEARCH.EXPRESSION_MATRIX, './pages/search/expressionmatrix/GeneExpressionMatrix.tsx'),
  route(PATHS.SEARCH.EXPERIMENT, './pages/search/experiments/Experiment/Experiment.jsx'),

  // Download routes
  route(PATHS.DOWNLOAD.DATA_DUMPS, './pages/download/DataDumps.tsx'),
  route(PATHS.DOWNLOAD.GENE_EXPRESSION_CALLS, './pages/download/GeneExpressionCalls.jsx'),
  route(PATHS.DOWNLOAD.PROCESSED_EXPRESSION_VALUES, './pages/download/ProcessedExpressionValues.jsx'),

  // Resources routes
  route(PATHS.RESOURCES.R_PACKAGES, './static/resources/rPackage.ts'),
  route(PATHS.RESOURCES.ANNOTATIONS, './static/resources/annotations.ts'),
  route(PATHS.RESOURCES.ONTOLOGIES, './static/resources/ontologies.ts'),
  route(PATHS.RESOURCES.SOURCE_CODE, './static/resources/source.ts'),

  // Support routes (most are in the routes folder)
  route(PATHS.SUPPORT.TUTORIALS, './static/support/Tutorials.ts'),
  route(PATHS.SUPPORT.VIDEOS, './static/support/videos.ts'),

  // About routes
  route(PATHS.ABOUT.NEWS, './pages/about/NewsPage.tsx'),
  route(PATHS.ABOUT.SOURCES, './pages/about/DataSource.tsx'),
  route(PATHS.ABOUT.ABOUT, './static/about/about.ts'),
  route(PATHS.ABOUT.COLLABORATIONS, './static/about/collaborations.ts'),
  route(PATHS.ABOUT.PUBLICATION, './static/about/publications.ts'),
  route(PATHS.ABOUT.TEAM, './static/about/team.ts'),
  route(PATHS.ABOUT.BGEESAB, './static/about/bgeesab.ts'),
  route(PATHS.ABOUT.PRIVACY_POLICY, './static/about/privacyPolicy.ts'),

  // https://reactrouter.com/how-to/file-route-conventions
  ...(await flatRoutes()),
] satisfies RouteConfig;
