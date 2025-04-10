import { type RouteConfig, index, route } from "@react-router/dev/routes";
import PATHS from './paths/paths';

// https://reactrouter.com/start/framework/routing

export default [
  // Home route
  index("routes/Home.jsx"),

  // Analysis routes
  route(PATHS.ANALYSIS.TOP_ANAT, './pages/analysis/TopAnat.jsx'),
  // route(PATHS.ANALYSIS.TOP_ANAT_RESULT, './pages/analysis/TopAnat.jsx'),
  // route(PATHS.ANALYSIS.TOP_ANAT_RESULT_JOB_ID, './pages/analysis/TopAnat.jsx'),
  route(PATHS.ANALYSIS.EXPRESSION_COMPARISON, './pages/analysis/ExpComp.jsx'),

  // Search routes
  route(PATHS.SEARCH.GENE, './pages/search/GeneList.jsx'),
  route(PATHS.SEARCH.GENE_ITEM, './pages/search/Gene.jsx'),
  // route(PATHS.SEARCH.GENE_ITEM_BY_SPECIES, './pages/search/Gene.jsx'),
  route(PATHS.SEARCH.ANATOMICAL_HOMOLOGY, './pages/search/AnatomicalHomologySearch.jsx'),
  route(PATHS.SEARCH.SPECIES, './pages/search/SpeciesList.jsx'),
  route(PATHS.SEARCH.SPECIES_ITEM, './pages/search/Species.jsx'),
  route(PATHS.SEARCH.GENE_LIST_ITEM_BY_SPECIES, './pages/search/SpeciesGeneList.jsx'),
  route(PATHS.SEARCH.RAW_DATA_ANNOTATIONS, './pages/search/rawdata/RawDataAnnotations.jsx'),
  // route(PATHS.SEARCH.EXPRESSION_CALLS, './pages/search/rawdata/RawDataAnnotations.jsx'),
  route(PATHS.SEARCH.EXPRESSION_MATRIX, './pages/search/expressionmatrix/GeneExpressionMatrix.jsx'),
  route(PATHS.SEARCH.EXPERIMENT, './pages/search/experiments/Experiment/Experiment.jsx'),

  // Download routes
  route(PATHS.DOWNLOAD.GENE_EXPRESSION_CALLS, './pages/download/GeneExpressionCalls.jsx'),
  route(PATHS.DOWNLOAD.PROCESSED_EXPRESSION_VALUES, './pages/download/ProcessedExpressionValues.jsx'),
  route(PATHS.DOWNLOAD.DATA_DUMPS, './pages/download/DataDumps.jsx'),

  // Resources routes
  // route(PATHS.RESOURCES.R_PACKAGES, './pages/resources/RPackage.jsx'),
  // route(PATHS.RESOURCES.ANNOTATIONS, './pages/resources/Annotations.jsx'),
  // route(PATHS.RESOURCES.ONTOLOGIES, './pages/resources/Ontologies.jsx'),
  // route(PATHS.RESOURCES.SOURCE_CODE, './pages/resources/SourceCode.jsx'),

  // Support routes (staticBuilder)
  // route(PATHS.SUPPORT.GTEX, './pages/support/DatasetsOfInterest.jsx'),
  // route(PATHS.SUPPORT.TUTORIALS, './pages/support/Tutorials.jsx'),
  // route(PATHS.SUPPORT.SCRNASEQPROTOCOLS, './pages/support/ScRNASeqProtocols.jsx'),
  // route(PATHS.SUPPORT.VIDEOS, './pages/support/Videos.jsx'),
  // route(PATHS.SUPPORT.TUTORIAL_GENE_PAGE, './pages/support/gene-page/TutorialGenePage.jsx'),
  // route(PATHS.SUPPORT.TUTORIAL_TOPANAT, './pages/support/topAnat/TopAnat.jsx'),
  // route(PATHS.SUPPORT.TUTORIAL_EXPRESSION_CALLS, './pages/support/present_absent-expression-calls/ExpressionCallSearch.jsx'),
  // route(PATHS.SUPPORT.TUTORIAL_SPARQL, './pages/support/sparql-tutorial/SparqlTutorial.jsx'),
  // route(PATHS.SUPPORT.TUTORIAL_CURATION, './pages/support/data-curation/DataCuration.jsx'),
  // route(PATHS.SUPPORT.TUTORIAL_EXPRESSION_COMPARISON, './pages/support/expression-comparison/ExpressionComparison.jsx'),
  // route(PATHS.SUPPORT.TUTORIAL_RAW_DATA, './pages/support/Raw-data-interface/RawDataInterface.jsx'),
  // route(PATHS.SUPPORT.TUTORIAL_ANAT_HOMOLOGY, './pages/support/anatomical-homology/AnatomicalHomology.jsx'),
  // route(PATHS.SUPPORT.TUTORIAL_AFFY_EXPR_VAL, './pages/support/Download-files/AffyProcExprValues.jsx'),
  // route(PATHS.SUPPORT.TUTORIAL_RNASEQ_EXPR_VAL, './pages/support/Download-files/RnaSeqProcExprValues.jsx'),
  // route(PATHS.SUPPORT.TUTORIAL_SCRNASEQ_FL_EXPR_VAL, './pages/support/Download-files/ScRNASeqFLProcExprValues.jsx'),
  // route(PATHS.SUPPORT.TUTORIAL_SCRNASEQ_TB_EXPR_VAL, './pages/support/Download-files/ScRNASeqTBProcExprValues.jsx'),
  // route(PATHS.SUPPORT.TUTORIAL_EXPR_VAL, './pages/support/Download-files/ProcExprValFile.jsx'),
  // route(PATHS.SUPPORT.TUTORIAL_GENE_EXPR, './pages/support/Download-files/GeneExpression.jsx'),
  // route(PATHS.SUPPORT.FAQ, './pages/support/FAQ.jsx'),

  // About routes
  route(PATHS.ABOUT.NEWS, './pages/about/NewsPage.jsx'),
  route(PATHS.ABOUT.SOURCES, './pages/about/DataSource.jsx'),
  // route(PATHS.ABOUT.ABOUT, './pages/about/About.jsx'),
  // route(PATHS.ABOUT.COLLABORATIONS, './pages/about/Collaborations.jsx'),
  // route(PATHS.ABOUT.PUBLICATION, './pages/about/Publications.jsx'),
  // route(PATHS.ABOUT.TEAM, './pages/about/Team.jsx'),
  // route(PATHS.ABOUT.BGEESAB, './pages/about/BgeeSAB.jsx'),
  // route(PATHS.ABOUT.PRIVACY_POLICY, './pages/about/PrivacyPolicy.jsx'),

  // Error route
  // route(PATHS.ERROR, './pages/Error.jsx'),
] satisfies RouteConfig;
