import { FULL_LENGTH_LABEL } from '../../api/prod/constant';
import imagePath from '../../helpers/imagePath';

const team = [
  {
    type: 'title',
    content: 'The Bgee Team',
  },
  {
    type: 'text',
    content:
      'This page provides information about the present and past Bgee team',
  },
  {
    type: 'section',
    title: 'Current Bgee Team members',
    children: [
      {
        type: 'only_image',
        src: imagePath('/team/Bgee-team-122024.png'),
        alt: 'The current Bgee team',
      },
      {
        type: 'rich_text',
        content: [
          {
            type: 'text',
            content: 'The Bgee team as of December 2023 photo (from left to right):',
          },
        ],
      },
      {
        type: 'unordered_list',
        children: [
          {
            type: 'rich_text',
            content: [
              {
                type: 'bold',
                content: 'Bastian, Frederic',
              },
              {
                type: 'text',
                content: ' (Associate Director: grant writer, MySQL and Java developer, Bgee howto) ',
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0000-0002-9415-5104',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'bold',
                content: 'Brandulas Cammarata, Alessandro',
              },
              {
                type: 'text',
                content: ` (Graduate student: explore what means a gene is expressed) `,
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0009-0006-5956-9842',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'bold',
                content: 'Dind, Sagane',
              },
              {
                type: 'text',
                content: ' (Bioinformatician: pre-filter data before curation, molecular protocol master) ',
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0000-0003-4771-6113',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'bold',
                content: 'Niknejad, Anne',
              },
              {
                type: 'text',
                content:
                  ' (Lead biocurator: provide reference healthy wild-type expression data: the Bgee core) ',
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0000-0003-3308-6245',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'bold',
                content: 'Carsanaro, Sara',
              },
              {
                type: 'text',
                content: ` (Biocurator: sc-FAIR guru, how to make ${FULL_LENGTH_LABEL} metadata useful and usable) `,
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0009-0002-8634-7138',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'bold',
                content: 'Moretti, Sebastien',
              },
              {
                type: 'text',
                content:
                  ' (Software Developer: pipeline and container developer, system administrator) ',
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0000-0003-3947-488X',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'bold',
                content: 'Nyamari, Marion',
              },
              {
                type: 'text',
                content: ` (Graduate student: Exploring the dynamics of gene expression variation and alternative splicing) `,
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0000-0003-0004-9982',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'bold',
                content: 'Wollbrett, Julien',
              },
              {
                type: 'text',
                content: ' (Software Developer: Bgee R packages maintainer, pipeline and Java developer) ',
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0000-0002-3099-3117',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'bold',
                content: 'Robinson-Rechavi, Marc',
              },
              {
                type: 'text',
                content:
                  ' (Associate Director: roadmap, idea agitator and provider, Bgee initiator) ',
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0000-0002-3437-3329',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'bold',
                content: 'Detering, Harry',
              },
              {
                type: 'text',
                content: ` (Making sense of data through visualisation, machine learning and workflow automation) `,
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0000-0002-0134-7618',
              },
              {
                type: 'text',
                content: ` (not on the picture)`,
              },
            ],
          },
        ],
      },
      {
        type: 'break_line',
      },
    ],
  },
  {
    type: 'section',
    title: 'Former Bgee Team members',
    children: [
      {
        type: 'rich_text',
        content: [
          {
            type: 'text',
            content: 'Alphabetically ordered list of former Bgee team members:',
          },
        ],
      },
      {
        type: 'unordered_list',
        children: [
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Comte, Aurelie',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Echchiki, Amina ',
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'http://orcid.org/0000-0003-3571-5420',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Escoriza, Angelique',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Fonseca Costa, Sara ',
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0000-0001-7794-7997',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Gharib, Walid ',
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0000-0003-4831-8408',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Gonzales-Porta, Mar ',
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0000-0002-1661-7254',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Huang, Wan-Ting ',
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0009-0006-7191-2455',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Jarosz, Yohan ',
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0000-0003-2047-0897',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Laurenczy, Balazs ',
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0000-0003-1601-8945',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Mendes de Farias, Tarcisio ',
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0000-0002-3175-5372',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Moret, Philippe ',
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0000-0002-3810-2091',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Parmentier, Gilles',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Person, Emilie',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Rech De Laval, Valentine ',
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0000-0002-3020-1490',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Roelli, Patrick ',
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0000-0002-5259-1434',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Rosikiewicz, Marta ',
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0000-0001-9123-1880',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Roux, Julien ',
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0000-0002-4192-5099',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Sanjeev, Komal',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Seppey, Mathieu ',
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0000-0003-3248-011X',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Schneider, Theo',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Tzivanopoulou, Marianna ',
              },
              {
                type: 'link_external',
                text: '[ORCID]',
                path: 'https://orcid.org/0000-0001-6931-2879',
              },
            ],
          },
        ],
      },
      {
        type: 'break_line',
      },
    ],
  },
];

export default team;
