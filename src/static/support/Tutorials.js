import imagePath from '../../helpers/imagePath';
import PATHS from '../../paths/paths';

const tutorialValues = [
  {
    type: 'title',
    content: 'Bgee Documentation',
  },
  {
    type: 'grid',
    content: [
      {
        children: [
          {
            type: 'card',
            title: 'Gene Search and Gene Page',
            image: {
              src: imagePath('/document-text-outline.svg'),
              alt: 'Document logo',
            },
            link: PATHS.SUPPORT.TUTORIAL_GENE_PAGE,
            linkType: 'internal',
            classNames: 'mb-3',
          },
          {
            type: 'rich_text',
            classNames: 'has-text-centered',
            content: [
              {
                type: 'text',
                content:
                  'How to search for a gene and the information you can get from the Bgee gene page.',
              },
            ],
          },
        ],
      },
      {
        children: [
          {
            type: 'card',
            title: 'TopAnat: an Anatomical Entity (Uberon) Enrichment Tool',
            image: {
              src: imagePath('/document-text-outline.svg'),
              alt: 'Document logo',
            },
            link: PATHS.SUPPORT.TUTORIAL_TOPANAT,
            linkType: 'internal',
            classNames: 'mb-3',
          },
          {
            type: 'rich_text',
            classNames: 'has-text-centered',
            content: [
              {
                type: 'text',
                content:
                  'How to use TopAnat and to identify anatomical entities that have over or under-represented gene expression.',
              },
            ],
          },
        ],
      },
      {
        children: [
          {
            type: 'card',
            title: 'Search for Present/Absent Expression Calls',
            image: {
              src: imagePath('/document-text-outline.svg'),
              alt: 'Document logo',
            },
            link: PATHS.SUPPORT.TUTORIAL_EXPRESSION_CALLS,
            linkType: 'internal',
            classNames: 'mb-3',
          },
          {
            type: 'rich_text',
            classNames: 'has-text-centered',
            content: [
              {
                type: 'text',
                content:
                  'How to search gene expression calls in the Bgee database.',
              },
            ],
          },
        ],
      },
      {
        children: [
          {
            type: 'card',
            title: 'Data Curation in Bgee',
            image: {
              src: imagePath('/document-text-outline.svg'),
              alt: 'Document logo',
            },
            link: PATHS.SUPPORT.TUTORIAL_CURATION,
            linkType: 'internal',
            classNames: 'mb-3',
          },
          {
            type: 'rich_text',
            classNames: 'has-text-centered',
            content: [
              {
                type: 'text',
                content:
                  'Background on data curation including what data are captured, relevant ontologies, and how data is integrated across species.',
              },
            ],
          },
        ],
      },
      {
        children: [
          {
            type: 'card',
            title: 'Querying the Bgee Knowledge Graph with SPARQL',
            image: {
              src: imagePath('/document-text-outline.svg'),
              alt: 'Document logo',
            },
            link: PATHS.SUPPORT.TUTORIAL_SPARQL,
            linkType: 'internal',
            classNames: 'mb-3',
          },
          {
            type: 'rich_text',
            classNames: 'has-text-centered',
            content: [
              {
                type: 'text',
                content:
                  'How to query the Bgee Knowledge Graph with SPARQL.',
              },
            ],
          },
        ],
      },
      {
        children: [
          {
            type: 'card',
            title: 'Expression Pattern Comparison',
            image: {
              src: imagePath('/document-text-outline.svg'),
              alt: 'Document logo',
            },
            link: PATHS.SUPPORT.TUTORIAL_EXPRESSION_COMPARISON,
            linkType: 'internal',
            classNames: 'mb-3',
          },
          {
            type: 'rich_text',
            classNames: 'has-text-centered',
            content: [
              {
                type: 'text',
                content:
                  'Compare gene expression across anatomical structures for a list of genes.',
              },
            ],
          },
        ],
      },
      {
        children: [
          {
            type: 'card',
            title: 'Search Experiments, Data Annotations, and Processed Expression Values',
            image: {
              src: imagePath('/document-text-outline.svg'),
              alt: 'Document logo',
            },
            link: PATHS.SUPPORT.TUTORIAL_RAW_DATA,
            linkType: 'internal',
            classNames: 'mb-3',
          },
          {
            type: 'rich_text',
            classNames: 'has-text-centered',
            content: [
              {
                type: 'text',
                content:
                  'How to search and filter experiments, raw data annotations, and processed expression values in the Bgee database.',
              },
            ],
          },
        ],
      },
      {
        children: [
          {
            type: 'card',
            title: 'Anatomical Homology',
            image: {
              src: imagePath('/document-text-outline.svg'),
              alt: 'Document logo',
            },
            link: PATHS.SUPPORT.TUTORIAL_ANAT_HOMOLOGY,
            linkType: 'internal',
            classNames: 'mb-3',
          },
          {
            type: 'rich_text',
            classNames: 'has-text-centered',
            content: [
              {
                type: 'text',
                content:
                  'How to retrieve anatomical entities that are homologous among different species.',
              },
            ],
          },
        ],
      },
      {
        children: [
          {
            type: 'card',
            title: 'Expression Calls Files',
            image: {
              src: imagePath('/document-text-outline.svg'),
              alt: 'Document logo',
            },
            link: PATHS.SUPPORT.TUTORIAL_GENE_EXPR,
            linkType: 'internal',
            classNames: 'mb-3',
          },
          {
            type: 'rich_text',
            classNames: 'has-text-centered',
            content: [
              {
                type: 'text',
                content:
                  'Detailed description of the contents and generation of the presence/absence expression calls download files.',
              },
            ],
          },
        ],
      },
      {
        children: [
          {
            type: 'card',
            title: 'Processed Expression Values File',
            image: {
              src: imagePath('/document-text-outline.svg'),
              alt: 'Document logo',
            },
            link: PATHS.SUPPORT.TUTORIAL_EXPR_VAL,
            linkType: 'internal',
            classNames: 'mb-3',
          },
          {
            type: 'rich_text',
            classNames: 'has-text-centered',
            content: [
              {
                type: 'text',
                content:
                  'Detailed description of the contents and generation of the processed expression and annotation metadata download files.',
              },
            ],
          },
        ],
      },
    ],
    cols: 3,
    fillRow: true,
  },
];

export default tutorialValues;
