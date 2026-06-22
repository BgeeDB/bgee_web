import { getMetadata } from '~/helpers/metadata';
import staticBuilder from '~/helpers/staticBuilder';

export function meta() {
  return getMetadata({
    title: 'Bgee Scientific Advisory Board',
    description: 'The Bgee Scientific Advisory Board (SAB)',
    keywords: 'Scientific Advisory Board, SAB',
  });
}

export default function Page() {
  return staticBuilder(bgeesab);
}

const bgeesab = [
  {
    type: 'title',
    content: 'The Bgee Scientific Advisory Board (SAB)',
  },
  {
    type: 'text',
    content:
      'The SAB acts as a consultative body, providing recommendations to the Bgee team. Its main tasks consist in advising on strategy of development of the resource, as well as advice on methods, services or tools.',
  },
  {
    type: 'section',
    title: 'The Bgee Scientific Advisory Board members',
    children: [
      {
        type: 'unordered_list',
        children: [
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Dr. ',
              },
              {
                type: 'link_external',
                path: 'https://www.martamele.com/',
                text: 'Marta Melé Messeguer',
              },
              {
                type: 'text',
                content:
                  ', Group Leader at the Life Sciences Department of the Barcelona Supercomputing Center, Barcelona, Spain',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Prof. ',
              },
              {
                type: 'link_external',
                path: 'https://som.cuanschutz.edu/Profiles/Faculty/Profile/35865',
                text: 'Monica Munoz-Torres',
              },
              {
                type: 'text',
                content:
                  ', Associate Professor of Biomedical Informatics at the School of Medicine, University of Colorado, Colorado, USA',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Prof. ',
              },
              {
                type: 'link_external',
                path: 'https://www.ed.ac.uk/profile/chris-ponting',
                text: 'Chris Ponting',
              },
              {
                type: 'text',
                content:
                  ', Chair of Medical Bioinformatics and a Principal Investigator at the MRC Human Genetics Unit, Institute of Genetics and Cancer, University of Edinburgh, Scotland',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Prof. ',
              },
              {
                type: 'link_external',
                path: 'https://www.jax.org/research-and-faculty/research-labs/the-ringwald-lab',
                text: 'Martin Ringwald',
              },
              {
                type: 'text',
                content: ', Associate Professor at the Jackson Laboratory for Genomic Medicine - MGI, Connecticut, USA',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Prof. ',
              },
              {
                type: 'link_external',
                path: 'https://robinsonlabuzh.github.io/',
                text: 'Mark D Robinson',
              },
              {
                type: 'text',
                content:
                  ', Group Leader at the Department of Molecular Life Sciences, Faculty of Science, University of Zurich, Zurich, Switzerland',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Dr. ',
              },
              {
                type: 'link_external',
                path: 'https://www.ibens.ens.fr/?rubrique43&lang=en',
                text: 'Hugues Roest Crollius',
              },
              {
                type: 'text',
                content:
                  ', Research Director at CNRS; group leader at the Institut of Biology; Adjunct Professor of Evolutionary Genomics, ENS, Paris, France',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Prof. ',
              },
              {
                type: 'link_external',
                path: 'https://sites.google.com/usc.edu/thomaslab/dr-thomas',
                text: 'Paul Thomas',
              },
              {
                type: 'text',
                content:
                  ', Professor at the Department of Preventive Medicine, Keck School of Medicine; Professor at the Department of Quantitative and Computational Biology, Dornsife School of Letters and Sciences; Director of the Gene Ontology Consortium, University of Southern California, California, USA',
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
    title: 'The Bgee Scientific Advisory Board meetings',
    children: [
      {
        type: 'bold',
        content: 'Upcoming Bgee SAB meeting',
      },
      {
        type: 'unordered_list',
        children: [
          {
            type: 'text',
            content: 'September 2026',
          },
        ],
      },
      {
        type: 'bold',
        content: 'Past Bgee SAB meetings',
      },
      {
        type: 'unordered_list',
        children: [
          {
            type: 'text',
            content: 'April 15 2025',
          },
          {
            type: 'text',
            content: 'February 26 2024',
          },
          {
            type: 'text',
            content: 'April 28 2023',
          },
        ],
      },
    ],
  },
  {
    type: 'section',
    title: 'Former Bgee Scientific Advisory Board members',
    children: [
      {
        type: 'unordered_list',
        children: [
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Prof. ',
              },
              {
                type: 'link_external',
                path: 'https://profiles.stanford.edu/j-michael-cherry',
                text: 'Mike Cherry',
              },
              {
                type: 'text',
                content:
                  ', Professor (Research) of Genetics, Department of Genetics, Stanford School of Medicine, Stanford University, California, USA',
              },
            ],
          },
        ],
      },
    ],
  },
];
