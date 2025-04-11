import imagePath from '../../helpers/imagePath';
import { getMetadata } from '~/helpers/metadata';
import staticBuilder from '~/helpers/staticBuilder';

export function meta() {
  return getMetadata({
    title: 'Ontology resources',
    description: 'Access ontologies used or developed as part of the Bgee project.',
    keywords: 'Developmental and life stage ontologies, Confidence Information Ontology, CIO ontology, Homology Ontology, HOM ontology, Uberon ontology, NCBITaxon ontology, NCBI taxonomy ontology',
  });
}

export default function Page() {
  return staticBuilder(ontologies)
}

const ontologies = [
  {
    type: 'title',
    content: 'Ontology resources',
  },
  {
    type: 'grid',
    content: [
      {
        children: [
          {
            type: 'card',
            title: 'Developmental stage ontologies',
            image: {
              src: imagePath('/logo/github-logo.png'),
              alt: 'Github logo',
            },
            link: 'https://github.com/obophenotype/developmental-stage-ontologies',
            linkType: 'external',
            classNames: 'mb-3',
          },
          {
            type: 'rich_text',
            classNames: 'has-text-centered',
            content: [
              {
                type: 'text',
                content:
                  'A collection of species-specific developmental stage ontologies. The custom version of this ontology generated for Bgee and information on how to create it are available on ',
              },
              {
                type: 'link_external',
                path: 'https://github.com/obophenotype/developmental-stage-ontologies/tree/master/external/bgee',
                text: 'GitHub',
              },
              {
                type: 'text',
                content: '.',
              },
            ],
          },
        ],
      },
      {
        children: [
          {
            type: 'card',
            title: 'Confidence Information Ontology (CIO)',
            image: {
              src: imagePath('/logo/github-logo.png'),
              alt: 'Github logo',
            },
            link: 'https://github.com/BgeeDB/confidence-information-ontology',
            linkType: 'external',
            classNames: 'mb-3',
          },
          {
            type: 'text',
            classNames: 'has-text-centered',
            content:
              'Ontology providing confidence information about annotation assertions in a systematic manner.',
          },
        ],
      },
      {
        children: [
          {
            type: 'card',
            title: 'Homology ontology (HOM)',
            image: {
              src: imagePath('/logo/github-logo.png'),
              alt: 'Github logo',
            },
            link: 'https://github.com/BgeeDB/homology-ontology',
            linkType: 'external',
            classNames: 'mb-3',
          },
          {
            type: 'text',
            classNames: 'has-text-centered',
            content:
              'Ontology describing homology-related concepts, notably used in our annotations of similarity between anatomical structures.',
          },
        ],
      },
      {
        children: [
          {
            type: 'card',
            title: 'Uberon ontology',
            image: {
              src: imagePath('/logo/uberon-logo.png'),
              alt: 'Uberon logo',
            },
            link: 'https://uberon.github.io/',
            linkType: 'external',
            classNames: 'mb-3',
          },
          {
            type: 'rich_text',
            classNames: 'has-text-centered',
            content: [
              {
                type: 'text',
                content:
                  'Bgee uses the cross-species ontology Uberon covering anatomical structures in animals. A ',
              },
              {
                type: 'link_external',
                path: 'https://github.com/BgeeDB/bgee_pipeline/tree/master/generated_files/uberon',
                text: 'custom version',
              },
              {
                type: 'text',
                content:
                  ' is generated for Bgee. Steps explaining how and why this custom version is generated are described ',
              },
              {
                type: 'link_external',
                path: 'https://github.com/BgeeDB/bgee_pipeline/tree/master/pipeline/uberon#anatomical-ontology-todos-before-pipeline-run',
                text: 'on GitHub',
              },
              {
                type: 'text',
                content:
                  '. We also manually modified mapping to terms from external ontologies.',
              },
            ],
          },
        ],
      },
      {
        children: [
          {
            type: 'card',
            title: 'NCBITaxon ontology',
            image: {
              src: imagePath('/logo/obofoundry-logo.png'),
              alt: 'OBOfoundry logo',
            },
            link: 'http://www.obofoundry.org/ontology/ncbitaxon.html',
            linkType: 'external',
            classNames: 'mb-3',
          },
          {
            type: 'rich_text',
            classNames: 'has-text-centered',
            content: [
              {
                type: 'text',
                content: 'Bgee uses the NCBITaxon ontology. A ',
              },
              {
                type: 'link_external',
                path: 'https://github.com/BgeeDB/bgee_pipeline/tree/master/generated_files/species',
                text: 'custom version',
              },
              {
                type: 'text',
                content:
                  ' is generated for Bgee. Steps explaining how and why this custom version is generated are described ',
              },
              {
                type: 'link_external',
                path: 'https://github.com/BgeeDB/bgee_pipeline/tree/master/pipeline/species#details',
                text: 'on GitHub',
              },
              {
                type: 'text',
                content: '.',
              },
            ],
          },
        ],
      },
    ],
    cols: 4,
    fillRow: true,
  },
];
