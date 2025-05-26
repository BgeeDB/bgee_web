import config from '../../config.json';
import imagePath from '../../helpers/imagePath';

// TODO how to link David Osumi-Sutherland? Which affiliation?
const collaborations = [
  {
    type: 'title',
    content: 'Bgee collaborations',
  },
  {
    type: 'text',
    content:
      'This page provides current and past collaborations of the Bgee project (in alphabetical order).',
  },
  {
    type: 'subsection',
    title: 'Current Bgee collaborations',
  },
  {
    type: 'section',
    title: 'gget',
    children: [
      {
        type: 'link_image',
        src: imagePath('/gget-logo.png'),
        path: 'https://github.com/pachterlab/gget',
        alt: 'gget',
      },
      {
        type: 'rich_text',
        content: [
          {
            type: 'link_external',
            path: 'https://github.com/pachterlab/gget',
            text: 'gget',
          },
          {
            type: 'text',
            content:
              ' is a free, open-source command-line tool and Python package that enables efficient querying of genomic databases.',
          },
        ],
      },
      {
        type: 'rich_text',
        content: [
          {
            type: 'link_external',
            path: 'https://pachterlab.github.io/gget/en/bgee.html',
            text: 'gget',
          },
          {
            type: 'text',
            content:
              ' fetches orthology and gene expression data from Bgee using Ensembl IDs.',
          },
        ],
      },
    ],
  },
  {
    type: 'section',
    title: 'OMA',
    children: [
      {
        type: 'link_image',
        src: imagePath('/oma-logo.png'),
        path: 'https://omabrowser.org/',
        alt: 'OMA',
      },
      {
        type: 'rich_text',
        content: [
          {
            type: 'text',
            content: 'The ',
          },
          {
            type: 'link_external',
            path: 'https://omabrowser.org/oma/home/',
            text: 'OMA (Orthologous MAtrix) project',
          },
          {
            type: 'text',
            content:
              ' is a method and database for the inference of orthologs among complete genomes.',
          },
        ],
      },
      {
        type: 'rich_text',
        content: [
          {
            type: 'text',
            content:
              'As part of a scientific collaboration with OMA, we generated files containing gene expression in homologous anatomical entities. These files are available on ',
          },
          {
            type: 'link_external',
            path: `${config.genericDomain}/ftp/bgee_v14_1/collaboration/branch_length_expression_divergence/`,
            text: 'Bgee FTP',
          },
          {
            type: 'text',
            content: '. ',
          },
        ],
      },
      {
        type: 'text',
        content:
          'The homologous expression files are also available and free to use for other projects or applications.',
      },
    ],
  },
  {
    type: 'section',
    title: 'Salmobase',
    children: [
      {
        type: 'link_image',
        src: imagePath('/Salmobase.png'),
        path: 'https://salmobase.org/',
        alt: 'Salmobase',
      },
      {
        type: 'rich_text',
        content: [
          {
            type: 'link_external',
            path: 'https://salmobase.org/',
            text: 'Salmobase',
          },
          {
            type: 'text',
            content:
              ' has been created for making molecular genomic resources for salmonid species publically available in a framework of visualizations and analytic tools.',
          },
        ],
      },
      {
        type: 'rich_text',
        content: [
          {
            type: 'text',
            content:
              'In coordination with Salmobase, Bgee developed an ',
          },
          {
            type: 'link_external',
            path: 'https://github.com/obophenotype/developmental-stage-ontologies/tree/master/src/ssaldv',
            text: 'Atlantic salmon developmental stages ontology',
          },
          {
            type: 'text',
            content:
              '.',
          },
        ],
      },
    ],
  },
  {
    type: 'section',
    title: 'scFAIR',
    children: [
      {
        type: 'link_image',
        src: imagePath('/sc-fair-logo.png'),
        path: 'https://sc-fair.org/',
        alt: 'scFAIR',
      },
      {
        type: 'rich_text',
        content: [
          {
            type: 'link_external',
            path: 'https://sc-fair.org/',
            text: 'scFAIR',
          },
          {
            type: 'text',
            content:
              ' is an ',
          },
          {
            type: 'link_external',
            path: 'https://www.swissuniversities.ch/en/topics/digitalisation/open-research-data/',
            text: 'Open Research Data (ORD)',
          },
          {
            type: 'text',
            content:
              ' project for the standardization and stewardship of single-cell metadata, funded by swissuniversities.',
          },
        ],
      },
      {
        type: 'rich_text',
        content: [
          {
            type: 'text',
            content:
              'The Bgee group is involved with the ',
          },
          {
            type: 'link_external',
            path: 'https://asap.epfl.ch/',
            text: 'ASAP',
          },
          {
            type: 'text',
            content:
              ' (SIB/EPFL) group in Switzerland, but the project is broader and involves also ',
          },
          {
            type: 'link_external',
            path: 'https://cellxgene.cziscience.com/',
            text: 'CZ CELLxGENE',
          },
          {
            type: 'text',
            content:
              ' and everyone interested in the standardization of single-cell metadata.',
          },
        ],
      },
    ],
  },
  {
    type: 'section',
    title: 'SIB AI',
    children: [
      {
        type: 'link_image',
        src: imagePath('/logo/sib-emblem.png'),
        path: 'https://www.sib.swiss/use-of-ai-to-increase-the-impact-of-sib-resources',
        alt: 'SIB AI',
      },
      {
        type: 'rich_text',
        content: [
          {
            type: 'link_external',
            path: 'https://www.sib.swiss/use-of-ai-to-increase-the-impact-of-sib-resources',
            text: 'SIB AI',
          },
          {
            type: 'text',
            content:
              ' is an SIB call to bring added value to the scientific impact of SIB Resources, while proposing innovative technologies - Artificial Intelligence (AI) - that will benefit the scientific community.',
          },
        ],
      },
      {
        type: 'rich_text',
        content: [
          {
            type: 'text',
            content:
              'The Bgee group is involved with the ',
          },
          {
            type: 'link_external',
            path: 'https://asap.epfl.ch/',
            text: 'ASAP/Deplancke',
          },
          {
            type: 'text',
            content:
              ' (SIB/EPFL) group, and the ',
          },
          {
            type: 'link_external',
            path: 'https://robinsonlabuzh.github.io/',
            text: 'Robinson Statistical Bioinformatics',
          },
          {
            type: 'text',
            content:
              ' (SIB/UZH) group to develop a pilot implementation of annotation of single-cell RNA-Seq data guided by AI.',
          },
        ],
      },
    ],
  },
  {
    type: 'break_line',
  },
  {
    type: 'break_line',
  },
  {
    type: 'subsection',
    title: 'Past Bgee collaborations',
  },
  {
    type: 'section',
    title: 'Bio-SODA',
    children: [
      {
        type: 'link_image',
        src: imagePath('/biosoda-logo.png'),
        path: 'https://www.zhaw.ch/en/research/research-database/project-detailview/projektid/1493/',
        alt: 'Bio-SODA',
      },
      {
        type: 'rich_text',
        content: [
          {
            type: 'link_external',
            path: 'https://www.zhaw.ch/en/research/research-database/project-detailview/projektid/1493/',
            text: 'BioSODA project',
          },
          {
            type: 'text',
            content:
              ' aims at enabling sophisticated semantic queries across large, decentralized and heterogeneous databases via an intuitive interface. The system will enable scientists, without prior training, to perform powerful joint queries across resources in ways that cannot be anticipated and therefore goes far and above the query functionality of specialized knowledge bases. It is supported by ',
          },
          {
            type: 'link_external',
            path: 'http://www.nfp75.ch/en',
            text: "NFP75 'Big Data'",
          },
          {
            type: 'text',
            content: '.',
          },
        ],
      },
      {
        type: 'rich_text',
        content: [
          {
            type: 'text',
            content:
              "For this project, we created a sub-database of Bgee called 'EasyBgee'. The MySQL dump is available on ",
          },
          {
            type: 'link_external',
            path: `${config.ftpDomain}/easybgee_dump.sql.gz`,
            text: 'Bgee FTP',
          },
          {
            type: 'text',
            content: ". You can see the description of 'EasyBgee' in ",
          },
          {
            type: 'link_external',
            path: 'https://github.com/BgeeDB/bgee_pipeline/tree/master/pipeline/easybgee_creation#information-about-the-easy-bgee-database',
            text: 'Bgee pipeline documentation',
          },
          {
            type: 'text',
            content: '.',
          },
        ],
      },
      {
        type: 'rich_text',
        content: [
          {
            type: 'text',
            content:
              "BioSODA uses the 'EasyBgee' relational database to expose a Bgee SPARQL endpoint, reachable through the following URL: ",
          },
          {
            type: 'code',
            content: 'https://www.bgee.org/sparql/',
          },
          {
            type: 'text',
            content: '. In the context of this project, the ',
          },
          {
            type: 'link_external',
            path: 'https://biosoda.expasy.org/',
            text: 'BioQuery web application',
          },
          {
            type: 'text',
            content:
              " provides a user-friendly interface to query 'EasyBgee' database based on the SPARQL query language.",
          },
        ],
      },
      {
        type: 'text',
        content:
          "The SPARQL endpoint and 'EasyBgee' are available and free to use for other projects or applications.",
      },
    ],
  },
  {
    type: 'section',
    title: 'INODE',
    children: [
      {
        type: 'link_image',
        src: imagePath('/INODE-Logo.png'),
        path: 'https://www.inode-project.eu/',
        alt: 'INODE',
        style: {
          backgroundColor: 'black',
        },
      },
      {
        type: 'rich_text',
        content: [
          {
            type: 'text',
            content: 'The ',
          },
          {
            type: 'link_external',
            path: 'https://www.inode-project.eu/',
            text: 'INODE (Intelligent Open Data Exploration) project',
          },
          {
            type: 'text',
            content:
              ' aims at simplifying access to data, by allowing a more dialectic and intuitive interaction with data, similar to a dialog with a human. The goal of INODE is to offer a suite of agile, fit-for-purpose and sustainable services for exploration of open data sets. It is funded by Horizon 2020 (',
          },
          {
            type: 'link_external',
            path: 'https://cordis.europa.eu/project/id/863410/fr',
            text: 'project 863410',
          },
          {
            type: 'text',
            content: ').',
          },
        ],
      },
      {
        type: 'text',
        content:
          'The Bgee team is one of the three use-case providers which the system will be initially developed and evaluated with. Bgee provides its expression data, and the cancer biomarker data from OncoMX (see below). The Bgee team collaborates on specifying the requirements of the system, adapting the data structure and format, and testing and evaluating the system.',
      },
    ],
  },
  {
    type: 'section',
    title: 'OncoMX',
    children: [
      {
        type: 'link_image',
        src: imagePath('/ONCOMX-logo.png'),
        path: 'https://www.oncomx.org/',
        alt: 'OncoMX',
      },
      {
        type: 'rich_text',
        content: [
          {
            type: 'link_external',
            path: 'https://www.oncomx.org/',
            text: 'OncoMX',
          },
          {
            type: 'text',
            content:
              ' is a knowledgebase of unified cancer genomics data from integrated mutation, expression, literature, and biomarker databases, accessible through a web portal. It is supported by ',
          },
          {
            type: 'link_external',
            path: 'https://www.cancer.gov/',
            text: 'NIH NCI',
          },
          {
            type: 'text',
            content: '.',
          },
        ],
      },
      {
        type: 'rich_text',
        content: [
          {
            type: 'text',
            content:
              'For this project, we generated files containing a subset of calls of presence/absence of expression with expression level categories specific to OncoMX. Files are available on ',
          },
          {
            type: 'link_external',
            path: `${config.genericDomain}/ftp/bgee_v14_2/collaboration/oncoMX/`,
            text: 'Bgee FTP',
          },
          {
            type: 'text',
            content: '. You can see the description of these files in ',
          },
          {
            type: 'link_external',
            path: 'https://github.com/BgeeDB/bgee_pipeline/tree/master/pipeline/collaboration/oncoMX#information-about-the-files-generated-for-oncomx',
            text: 'Bgee pipeline documentation',
          },
          {
            type: 'text',
            content: '.',
          },
        ],
      },
    ],
  },
];

export default collaborations;
