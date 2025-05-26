import PATHS from './paths';

import Home from '../pages/Home';

import TopAnatAnalysis from '../pages/analysis/TopAnat';
import ExpComp from '../pages/analysis/ExpComp';

import GeneList from '../pages/search/GeneList';
import Gene from '../pages/search/Gene';
import RawDataAnnotations from '../pages/search/rawdata/RawDataAnnotations';
import GeneExpressionMatrix from '../pages/search/expressionmatrix/GeneExpressionMatrix';
import AnatomicalHomologySearch from '../pages/search/AnatomicalHomologySearch';
import SpeciesList from '../pages/search/SpeciesList';
import Species from '../pages/search/Species';
import SpeciesGeneList from "../pages/search/SpeciesGeneList";

import Experiment from '../pages/search/experiments/Experiment';

import ProcessedExpressionValues from '../pages/download/ProcessedExpressionValues';
import GeneExpressionCallsDownload from '../pages/download/GeneExpressionCalls';

import RPackageFile from '../static/resources/rPackage';
import AnnotationsFile from '../static/resources/annotations';
import OntologiesFile from '../static/resources/ontologies';
import ResourceSourceFile from '../static/resources/source';

import DatasetsInterestFile from '../markdown/support/datasets_of_interest.md';
import TutoFile from '../static/support/Tutorials';
import ScRNASeqProtocolsFile from '../markdown/support/scRNA-seq_Protocols.md';
import VideoFile from '../static/support/videos';
import TutoGenePageFile from '../markdown/support/gene-page/Tutorial_gene_page.md';
import TutoTopAnatFile from '../markdown/support/topAnat/topAnat.md';
import TutoExpressionCallsFile from '../markdown/support/present_absent-expression-calls/Expression_call_search.md';
import TutoSPARQLFile from '../markdown/support/sparql-tutorial/sparql-tutorial.md';
import TutoCurationFile from '../markdown/support/data-curation/data-curation.md';
import TutoExpCompFile from '../markdown/support/expression-comparison/expression-comparison.md';
import TutoRawDataFile from '../markdown/support/Raw-data-interface/Raw-data-interface.md';
import TutoAnatHomologyFile from '../markdown/support/anatomical-homology/anatomical-homology.md';
import TutoAffyExprVal from '../markdown/support/Download-files/affyProcExprValues.md';
import TutoRNASeqExprVal from '../markdown/support/Download-files/rnaSeqProcExprValues.md';
import TutoscRNAseqFLExprVal from '../markdown/support/Download-files/scRNASeqFLProcExprValues.md';
import TutoscRNAseqTBExprVal from '../markdown/support/Download-files/scRNASeqTBProcExprValues.md';
import TutoExprVal from '../markdown/support/Download-files/procExprValFile.md';
import TutoGeneExpr from '../markdown/support/Download-files/geneExpression.md';
import FaqFile from '../markdown/support/FAQ.md';

import AboutFile from '../static/about/about';
import CollaborationsFile from '../static/about/collaborations';
import PublicationsFile from '../static/about/publications';
import TeamFile from '../static/about/team';
import SABFile from '../static/about/bgeesab';
import PrivacyPolicyFile from '../static/about/privacyPolicy';

import Error from '../pages/Error';
import DataDumps from '../pages/download/DataDumps';
import NewsPage from '../pages/about/NewsPage';
import DataSource from '../pages/about/DataSource';

const ANALYSIS = {
  [PATHS.ANALYSIS.TOP_ANAT]: {
    title: 'TopAnat: Expression enrichment analysis',
    component: TopAnatAnalysis,
    meta: {
      title: 'TopAnat: Expression enrichment analysis',
      description: 'GO-like enrichment of anatomical terms, mapped to genes by expression patterns',
      keywords: 'Enrichment, Gene expression, Anatomical terms',
    },
  },
  [PATHS.ANALYSIS.EXPRESSION_COMPARISON]: {
    title: 'Expression comparison',
    component: ExpComp,
    meta: {
      title: 'Expression comparison analysis',
      description:
        'Compare gene expression within species, or between species using homology relations between anatomical entities.',
      keywords:
        'gene expression comparison, homology, gene expression patterns, expression call comparison',
    },
  },
};

const SEARCH = {
  [PATHS.SEARCH.GENE]: {
    title: 'Genes',
    component: GeneList,
  },
  [PATHS.SEARCH.GENE_ITEM]: {
    component: Gene,
    title: 'Gene',
  },
  [PATHS.SEARCH.ANATOMICAL_HOMOLOGY]: {
    component: AnatomicalHomologySearch,
    title: 'Anatomical homologies',
    meta: {
      title: 'Anatomical homology search',
      description:
        'Identify relations of homology and anatomical similarity between anatomical entities.',
      keywords: 'homology, similarity, anatomical entity',
    },
  },
  [PATHS.SEARCH.SPECIES]: {
    component: SpeciesList,
    title: 'Species',
  },
  [PATHS.SEARCH.SPECIES_ITEM]: {
    component: Species,
    title: 'Species',
  },
  [PATHS.SEARCH.GENE_LIST_ITEM_BY_SPECIES]: {
    component: SpeciesGeneList,
    title: 'Species gene list',
  },
  [PATHS.SEARCH.RAW_DATA_ANNOTATIONS]: {
    component: () => <RawDataAnnotations />,
    title: 'Raw data annotated and processed',
    meta: {
      title: 'Raw data annotated and processed',
      description: 'Search for Experiments, Raw data annotations and Processed expression values',
      keywords: 'Raw data, annotations, annotated, processed, experiments, raw data annotations, processed expression values',
    },
  },
  [PATHS.SEARCH.EXPRESSION_CALLS]: {
    component: () => <RawDataAnnotations isExprCalls />,
    title: 'Present/absent expression calls',
    meta: {
      title: 'Present/absent expression calls',
      description: 'Search for Present/absent expression calls',
      keywords: 'Present, absent, expression calls',
    },
  },
  [PATHS.SEARCH.EXPRESSION_MATRIX]: {
    component: () => <GeneExpressionMatrix isExprCalls />,
    title: 'Gene expression matrix (beta)',
  },
  [PATHS.SEARCH.EXPERIMENT]: {
    component: Experiment,
    title: 'Experiment informations',
  },
};

const DOWNLOAD = {
  [PATHS.DOWNLOAD.GENE_EXPRESSION_CALLS]: {
    component: GeneExpressionCallsDownload,
    title: 'Download gene expression calls',
  },
  [PATHS.DOWNLOAD.PROCESSED_EXPRESSION_VALUES]: {
    component: ProcessedExpressionValues,
    title: 'Download processed expression values',
  },
  [PATHS.DOWNLOAD.DATA_DUMPS]: {
    component: DataDumps,
    title: 'Data dumps',
  },
};

const RESOURCES = {
  [PATHS.RESOURCES.R_PACKAGES]: {
    source: RPackageFile,
    title: 'R packages',
    meta: {
      title: 'R packages and containers available',
      description:
        'Access R packages allowing to retrieve Bgee data, or to perform Bgee analyses on your own data.',
      keywords: 'R package, Bioconductor, BgeeDB, BgeeCall, Docker container',
    },
  },
  [PATHS.RESOURCES.ANNOTATIONS]: {
    source: AnnotationsFile,
    title: 'Annotation resources',
    meta: {
      title: 'Annotation resources',
      description:
        'Access annotations of expression data and of anatomical similarities produced by Bgee.',
      keywords:
        'Anatomical similarity annotations, RNA-Seq annotations, Affymetrix annotations, EST annotations, GTEx annotations, scRNA-Seq annotations',
    },
  },
  [PATHS.RESOURCES.ONTOLOGIES]: {
    source: OntologiesFile,
    title: 'Ontology resources',
    meta: {
      title: 'Ontology resources',
      description:
        'Access ontologies used or developed as part of the Bgee project.',
      keywords:
        'Developmental and life stage ontologies, Confidence Information Ontology, CIO ontology, Homology Ontology, HOM ontology, Uberon ontology, NCBITaxon ontology, NCBI taxonomy ontology',
    },
  },
  [PATHS.RESOURCES.SOURCE_CODE]: {
    source: ResourceSourceFile,
    title: 'Source code',
    meta: {
      title: 'Source code information',
      description: 'Access the source code of the resources developed by Bgee.',
      keywords:
        'Source code, Bgee pipeline, bgee_pipeline, bgee_apps, BgeeDB, BgeeDB R package, BgeeCall, BgeeCall R package, IQRray',
    },
  },
};

const SUPPORT = {
  [PATHS.SUPPORT.GTEX]: {
    source: DatasetsInterestFile,
    title: 'Datasets of interest',
    meta: {
      title: 'Datasets of interest',
      description:
        'Retrieve information about the datasets of special interest present in Bgee and how we integrated them.',
      keywords: 'Dataset, gene expression dataset, GTEx, Fly Cell Atlas, FCA, featured experiments, annotation',
    },
  },
  [PATHS.SUPPORT.TUTORIALS]: {
    source: TutoFile,
    title: 'Documentation and tutorials',
    meta: {
      title: 'Documentation and tutorials',
      description: 'Bgee tutorials and documentation',
      keywords: 'Tutorials, documentation',
    },
  },
  [PATHS.SUPPORT.SCRNASEQPROTOCOLS]: {
    source: ScRNASeqProtocolsFile,
    title: 'scRNA-Seq Protocols: A Comparative Guide',
    meta: {
      title: 'Single-cell RNA Sequencing (scRNA-Seq) Protocols: A Comparative Guide',
      description: 'Single-cell RNA Sequencing (scRNA-Seq) Protocols: A Comparative Guide',
      keywords: 'Single-cell RNA Sequencing, scRNA-Seq, protocols, Comparative Guide',
    },
  },
  [PATHS.SUPPORT.VIDEOS]: {
    source: VideoFile,
    title: 'Course videos',
    meta: {
      title: 'Course videos',
      description: 'Bgee tutorial videos and online courses',
      keywords:
        'The Bgee videos, Bgee videos, Bgee YouTube, Bgee online courses',
    },
  },
  [PATHS.SUPPORT.TUTORIAL_GENE_PAGE]: {
    source: TutoGenePageFile,
    title: 'Tutorial: gene page',
    meta: {
      title: 'Bgee gene page tutorial',
      description: 'Bgee Tutorial about gene search and gene page',
      keywords: 'Tutorial, gene, search',
    },
  },
  [PATHS.SUPPORT.TUTORIAL_TOPANAT]: {
    source: TutoTopAnatFile,
    title: 'Tutorial: TopAnat',
    meta: {
      title: 'Bgee TopAnat tutorial',
      description: 'Bgee Tutorial about TopAnat Uberon enrichment analysis',
      keywords: 'Tutorial, enrichment analysis, Uberon',
    },
  },
  [PATHS.SUPPORT.TUTORIAL_EXPRESSION_CALLS]: {
    source: TutoExpressionCallsFile,
    title: 'Tutorial: expression calls',
    meta: {
      title: 'Bgee expression calls tutorial',
      description: 'Bgee Tutorial about expression calls search',
      keywords: 'Tutorial, expression calls, search',
    },
  },
  [PATHS.SUPPORT.TUTORIAL_SPARQL]: {
    source: TutoSPARQLFile,
    title: 'Tutorial: knowledge graph query',
    meta: {
      title: 'Bgee knowledge graph tutorial',
      description: 'Bgee Tutorial about knowledge graph',
      keywords: 'Tutorial, knowledge graph, RDF, SPARQL, gene-expression profile',
    },
  },
  [PATHS.SUPPORT.TUTORIAL_CURATION]: {
    source: TutoCurationFile,
    title: 'Tutorial: data curation',
    meta: {
      title: 'Bgee data curation tutorial',
      description: 'Bgee Tutorial about data curation and annotation',
      keywords: 'Tutorial, data curation, annotation',
    },
  },
  [PATHS.SUPPORT.TUTORIAL_EXPRESSION_COMPARISON]: {
    source: TutoExpCompFile,
    title: 'Tutorial: expression comparison',
    meta: {
      title: 'Bgee expression comparison tutorial',
      description: 'Bgee Tutorial about expression comparison of genes',
      keywords: 'Tutorial, expression comparison, genes',
    },
  },
  [PATHS.SUPPORT.TUTORIAL_RAW_DATA]: {
    source: TutoRawDataFile,
    title: 'Tutorial: raw data',
    meta: {
      title: 'Bgee raw data interface tutorial',
      description: 'Bgee Tutorial about the raw data interface',
      keywords: 'Tutorial, raw data, experiments, libraries, processed expression values',
    },
  },
  [PATHS.SUPPORT.TUTORIAL_ANAT_HOMOLOGY]: {
    source: TutoAnatHomologyFile,
    title: 'Tutorial: anatomical homology',
    meta: {
      title: 'Bgee anatomical homology tutorial',
      description: 'Bgee Tutorial about anatomical homology',
      keywords: 'Tutorial, anatomical homology, tool, analysis, search',
    },
  },
  [PATHS.SUPPORT.TUTORIAL_AFFY_EXPR_VAL]: {
    source: TutoAffyExprVal,
    title: 'Tutorial: Affymetrix download file documentation',
    meta: {
      title: 'Bgee Affymetrix download file documentation: annotations and processed expression values tutorial',
      description: 'Bgee Tutorial about Affymetrix download file documentation: annotations and processed expression values',
      keywords: 'Tutorial, Affymetrix, Download file, Processed expression values',
    },
  },
  [PATHS.SUPPORT.TUTORIAL_RNASEQ_EXPR_VAL]: {
    source: TutoRNASeqExprVal,
    title: 'Tutorial: RNA-Seq download file documentation',
    meta: {
      title: 'Bgee RNA-Seq download file documentation: annotations and processed expression values tutorial',
      description: 'Bgee Tutorial about RNA-Seq download file documentation: annotations and processed expression values',
      keywords: 'Tutorial, RNA-Seq, Download file, Processed expression values',
    },
  },
  [PATHS.SUPPORT.TUTORIAL_SCRNASEQ_FL_EXPR_VAL]: {
    source: TutoscRNAseqFLExprVal,
    title: 'Tutorial: Single cell RNA-Seq full-length download file documentation',
    meta: {
      title: 'Bgee Single cell RNA-Seq full-length download file documentation: annotations and processed expression values tutorial',
      description: 'Bgee Tutorial about Single cell RNA-Seq full-length download file documentation: annotations and processed expression values',
      keywords: 'Tutorial, Single cell RNA-Seq full-length, scRNA-seq full-length, Download file, Processed expression values',
    },
  },
  [PATHS.SUPPORT.TUTORIAL_SCRNASEQ_TB_EXPR_VAL]: {
    source: TutoscRNAseqTBExprVal,
    title: 'Tutorial: Droplet-based scRNA-seq Data in H5AD Format',
    meta: {
      title: 'Bgee Droplet-based scRNA-seq Data in H5AD Format tutorial',
      description: 'Bgee Tutorial about Droplet-based scRNA-seq Data in H5AD Format',
      keywords: 'Tutorial, Single cell RNA-Seq Droplet-based, scRNA-seq Droplet-based, Single cell RNA-Seq target-based, scRNA-seq target-based, Download file, Processed expression values, H5AD',
    },
  },
  [PATHS.SUPPORT.TUTORIAL_EXPR_VAL]: {
    source: TutoExprVal,
    title: 'Tutorial: Processed expression values download file documentation',
    meta: {
      title: 'Bgee Processed expression values download file documentation tutorial',
      description: 'Bgee Tutorial about Processed expression values download file documentation',
      keywords: 'Tutorial, Download file, Processed expression values',
    },
  },
  [PATHS.SUPPORT.TUTORIAL_GENE_EXPR]: {
    source: TutoGeneExpr,
    title: 'Tutorial: Expression call download file documentation',
    meta: {
      title: 'Bgee Expression call download file documentation tutorial',
      description: 'Bgee Tutorial about Expression call download file documentation',
      keywords: 'Tutorial, Download file, Expression call',
    },
  },
  [PATHS.SUPPORT.FAQ]: {
    source: FaqFile,
    title: 'FAQ',
    meta: {
      title: 'FAQ',
      description: 'Answers to Frequently Asked Questions',
      keywords: 'FAQ, Frequently Asked Questions',
    },
  },
};

const ABOUT = {
  [PATHS.ABOUT.ABOUT]: {
    source: AboutFile,
    title: 'About Bgee',
    meta: {
      title: 'About Bgee',
      description: 'General information about Bgee and the team developing it.',
      keywords: 'About, license, CC0',
    },
  },
  [PATHS.ABOUT.NEWS]: {
    component: NewsPage,
    title: 'Bgee News',
    meta: {
      title: 'Bgee news',
      description: 'Bgee news describing each new releases',
      keywords: 'News, latest, information, releases',
    },
  },
  [PATHS.ABOUT.COLLABORATIONS]: {
    source: CollaborationsFile,
    title: 'Bgee collaborations',
    meta: {
      title: 'Bgee collaborations',
      description:
        'Examples of collaboration with groups making use of Bgee data.',
      keywords: 'Collaborations, Bio-SODA, INODE, OMA, OncoMX',
    },
  },
  [PATHS.ABOUT.PUBLICATION]: {
    source: PublicationsFile,
    title: 'Bgee publications',
    meta: {
      title: 'Bgee publications',
      description:
        'List of publications about Bgee and related tools to use to cite us.',
      keywords: 'cite us, how to cite us, publications',
    },
  },
  [PATHS.ABOUT.SOURCES]: {
    component: DataSource,
    title: 'Bgee sources',
    meta: {
      title: 'Data sources',
      description:
        'List of the sources and the versions used to build the Bgee database.',
      keywords: 'data sources, data source versions',
    },
  },
  [PATHS.ABOUT.TEAM]: {
    source: TeamFile,
    title: 'Bgee team',
    meta: {
      title: 'Bgee team',
      description: 'The Bgee team from SIB/UNIL',
      keywords: 'The Bgee team, Bgee team, SIB bgee, UNIL bgee',
    },
  },
  [PATHS.ABOUT.BGEESAB]: {
    source: SABFile,
    title: 'Bgee SAB',
    meta: {
      title: 'Bgee Scientific Advisory Board',
      description: 'The Bgee Scientific Advisory Board (SAB)',
      keywords: 'Scientific Advisory Board, SAB',
    },
  },
  [PATHS.ABOUT.PRIVACY_POLICY]: {
    source: PrivacyPolicyFile,
    title: 'Bgee privacy notice',
    meta: {
      title: 'Privacy notice',
      description:
        'Privacy notice describing the use of personal data by Bgee.',
      keywords:
        'privacy notice, privacy policy, personal data, data controller, personal data collection, GDPR',
    },
  },
};

const ROUTES = {
  [PATHS.HOME]: {
    component: Home,
    title: 'Bgee: gene expression data in animals',
  },
  ...ANALYSIS,
  ...SEARCH,
  ...DOWNLOAD,
  ...RESOURCES,
  ...SUPPORT,
  ...ABOUT,
  [PATHS.ERROR]: {
    title: 'Error',
    component: Error,
  },
};

export default ROUTES;
