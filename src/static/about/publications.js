import config from '../../config.json';
import { getMetadata } from '~/helpers/metadata';
import staticBuilder from '~/helpers/staticBuilder';

export function meta() {
  return getMetadata({
    title: 'Bgee publications',
    description: 'List of publications about Bgee and related tools to use to cite us.',
    keywords: 'cite us, how to cite us, publications',
  });
}

export default function Page() {
  return staticBuilder(publications)
}

const publications = [
  {
    type: 'title',
    content: 'Publications',
  },
  {
    type: 'section',
    title: 'How to cite Bgee?',
    children: [
      {
        type: 'text',
        content: 'If you find Bgee useful please consider citing:',
      },
      {
        type: 'unordered_list',
        children: [
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content:
                  'Bastian FB, Brandulas Cammarata A, Carsanaro S, Detering H, Huang W-T, Joye S, Niknejad A, Nyamari M, Mendes de Farias T, Moretti S, Tzivanopoulou M, Wollbrett J, Robinson-Rechavi M.',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'Bgee in 2024: focus on curated single-cell RNA-seq datasets, and query tools',
                path: 'https://doi.org/10.1093/nar/gkae1118',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: ' in ',
              },
              {
                type: 'text',
                content:
                  ' Nucleic Acids Research, 2025, 53:D878-D885. ',
              },
              {
                type: 'link_external',
                text: 'RIS',
                path: `${config.ftpDomain}/../general/citation_bgee_2024.ris`,
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content:
                  'Bastian FB, Roux J, Niknejad A, Comte A, Fonseca Costa SS, Mendes de Farias T, Moretti S, Parmentier G, Rech de Laval V, Rosikiewicz M, Wollbrett J, Echchiki A, Escoriza A, Gharib W, Gonzales-Porta M, Jarosz Y, Laurenczy B, Moret P, Person E, Roelli P, Sanjeev K, Seppey M, Robinson-Rechavi M.',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'The Bgee suite: integrated curated expression atlas and comparative transcriptomics in animals',
                path: 'https://doi.org/10.1093/nar/gkaa793',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: ' in ',
              },
              {
                type: 'text',
                content:
                  ' Nucleic Acids Research, 2021, 49:D831-D847. ',
              },
              {
                type: 'link_external',
                text: 'RIS',
                path: `${config.ftpDomain}/../general/citation_bgee_suite.ris`,
              },
            ],
          },
        ],
      },
      {
        type: 'text',
        content:
          'or choose the publication that best covers the Bgee aspects or components you used in your work from the list of publications below.',
      },
    ],
  },
  {
    type: 'section',
    title: 'How to cite specific components of Bgee?',
    children: [
      {
        type: 'unordered_list',
        children: [
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'For the development and life stage ontologies for animals:',
              },
              {
                type: 'break_line',
              },
              {
                type: 'text',
                content:
                  'Niknejad A, Mungall CJ, Osumi-Sutherland D, Robinson-Rechavi M, Bastian F.',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'Creation and unification of development and life stage ontologies for animals',
                path: 'https://doi.org/10.48550/arXiv.2206.12231',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: ' in ',
              },
              {
                type: 'text',
                content: 'arXiv, 2022.',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'For the BgeeDB R package:',
              },
              {
                type: 'break_line',
              },
              {
                type: 'text',
                content:
                  'Komljenovic A, Roux J, Wollbrett J, Robinson-Rechavi M, Bastian F.',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'BgeeDB, an R package for retrieval of curated expression datasets and for gene list enrichment tests',
                path: 'https://f1000research.com/articles/5-2748',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: ' in ',
              },
              {
                type: 'text',
                content: 'F1000Research, 2018, 5:2748. ',
              },
              {
                type: 'link_external',
                text: 'RIS',
                path: `${config.ftpDomain}/../general/citation05.ris`,
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'For UBERON:',
              },
              {
                type: 'break_line',
              },
              {
                type: 'text',
                content:
                  'Haendel MA, Balhoff JP, Bastian FB, Blackburn DC, Blake JA, Bradford Y, Comte A, Dahdul WM, Dececchi TA, Druzinsky RE, Hayamizu TF, Ibrahim N, Lewis SE, Mabee PM, Niknejad A, Robinson-Rechavi M, Sereno PC, Mungall CJ.',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'Unification of multi-species vertebrate anatomy ontologies for comparative biology in Uberon',
                path: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4089931/',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: ' in ',
              },
              {
                type: 'text',
                content: 'J Biomed Semantics, 2014, 5:21. ',
              },
              {
                type: 'link_external',
                text: 'RIS',
                path: `${config.ftpDomain}/../general/citation04.ris`,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: 'section',
    title: 'Other publications',
    children: [
      {
        type: 'unordered_list',
        children: [
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content:
                  'Emonet V, Bolleman J, Duvaud D, Mendes de Farias T, Sima AC',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'LLM-based SPARQL Query Generation from Natural Language over Federated Knowledge Graphs',
                path: 'https://doi.org/10.48550/arXiv.2410.06062',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: 'in ',
              },
              {
                type: 'text',
                content: 'arXiv, 2024.',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content:
                  'Bolleman J, Emonet V, Altenhoff A, Bairoch A, Blatter M-C, Bridge A, Duvaud S, Gasteiger E, Kuznetsov D, Moretti S, Michel P-A, Morgat A, Pagni M, Redaschi N, Zahn-Zabal M, Mendes de Farias T, Sima AC',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'A large collection of bioinformatics question-query pairs over federated knowledge graphs: methodology and applications',
                path: 'https://doi.org/10.1093/gigascience/giaf045',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: 'in ',
              },
              {
                type: 'text',
                content: 'GigaScience, 2025, 14:giaf045.',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content:
                  'Rangel JC, Mendes de Farias T, Sima AC, Kobayashi N.',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'SPARQL Generation: an analysis on fine-tuning OpenLLaMA for Question Answering over a Life Science Knowledge Graph',
                path: 'https://ceur-ws.org/Vol-3890/paper-4.pdf',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: 'in ',
              },
              {
                type: 'text',
                content: 'Semantic Web Applications and Tools for Health Care and Life Sciences, 2024, 3890:36-45.',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content:
                  'Mendes de Farias T, Altenhoff A, Bairoch A, Bastian FB, Crameri K, Dauvillier J, Dessimoz C, Glover N, Gnodtke K, Hayes C, Kriventseva E, Moretti S, Morgat A, Oesterle S, Sima A-C, Szklarczyk D, Topalov O, Toure V, Unni D, von Mering C, Wollbrett J, Zdobnov E, Samarasinghe K, Gehant S, Baratin D, Burdet B, Ibberson M, Redaschi N, Robinson-Rechavi M, Mehl F, Pagni M, Lisacek F, Bolleman J, Michel P-A, Zahn-Zabal M, Bridge AJ, Kuznetsov D, Bansal P.',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'The SIB Swiss Institute of Bioinformatics Semantic Web of data',
                path: 'https://doi.org/10.1093/nar/gkad902',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: 'in ',
              },
              {
                type: 'text',
                content: 'Nucleic Acids Research, 2024, 52:D44-D51.',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content:
                  'Kushida T, Mendes de Farias T, Sima A-C, Dessimoz C, Chiba H, Bastian FB, Masuya H.',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'Federated SPARQL query performance evaluation for exploring disease model mouse: combining gene expression, orthology, and disease knowledge graphs',
                path: 'https://doi.org/10.1186/s12911-025-03013-8',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: 'in ',
              },
              {
                type: 'text',
                content: 'BMC Medical Informatics and Decision Making, 2025, 25:189.',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content:
                  'Sima A-C, Mendes de Farias T.',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'On the Potential of Artificial Intelligence Chatbots for Data Exploration of Federated Bioinformatics Knowledge Graphs',
                path: 'https://ceur-ws.org/Vol-3466/paper1.pdf',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: 'in ',
              },
              {
                type: 'text',
                content: 'Proceedings of the 6th Workshop on Semantic Web Solutions for Large-Scale Biomedical Data Analytics, 2023, 3466:paper1.',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content:
                  'Mendes de Farias T, Wollbrett J, Robinson-Rechavi M, Bastian F.',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'Lessons learned to boost a bioinformatics knowledge base reusability, the Bgee experience',
                path: 'https://doi.org/10.1093/gigascience/giad058',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: 'in ',
              },
              {
                type: 'text',
                content: 'GigaScience, 2023, 12:giad058.',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content:
                  'Mendes de Farias T, Kushida T, Sima A-C, Dessimoz C, Chiba H, Bastian F, Masuya H.',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'Data in use for Alzheimer disease study: combining gene expression, orthology, bioresource and disease datasets',
                path: 'https://ceur-ws.org/Vol-3415/paper-47.pdf',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: 'in ',
              },
              {
                type: 'text',
                content: 'Semantic Web Applications and Tools for Health Care and Life Sciences, 2023, 3415:177–178.',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content:
                  'Dingerdissen HM, Bastian FB, Vijay-Shanker K, Robinson-Rechavi M, Bell A, Gogate N, Gupta S, Holmes E, Kahsay R, Keeney J, Kincaid H, King CH, Liu D, Crichton DJ, Mazumder R.',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'OncoMX: A Knowledgebase for Exploring Cancer Biomarkers in the Context of Related Cancer and Healthy Data',
                path: 'https://doi.org/10.1200/CCI.19.00117',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: 'in ',
              },
              {
                type: 'text',
                content: 'JCO Clinical Cancer Informatics, 2020, 4:210-220.',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content:
                  'Chen Q, Britto R, Erill I, Jeffery CJ, Liberzon A, Magrane M, Onami J, Robinson-Rechavi M, Sponarova J, Zobel J, Karin Verspoor.',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'Quality Matters: Biocuration Experts on the Impact of Duplication and Other Data Quality',
                path: 'https://doi.org/10.1016/j.gpb.2018.11.006',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: 'in ',
              },
              {
                type: 'text',
                content: 'Genomics, Proteomics & Bioinformatics, 2020, 18:91-103.',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content:
                  'Robinson-Rechavi M, Rech de Laval V, Bastian FB, Wollbrett J, Bgee Team.',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'The Expression Comparison Tool in Bgee',
                path: 'https://hal.archives-ouvertes.fr/hal-02535720',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: 'in ',
              },
              {
                type: 'text',
                content:
                  'Scornavacca C, Delsuc F, Galtier N. Phylogenetics in the Genomic Era. No commercial publisher | Authors open access book, 2020, pp.4.3:1-4.3:4.',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content:
                  'Sima AC, Mendes de Farias T, Zbinden E, Anisimova M, Gil M, Stockinger H, Stockinger K, Robinson-Rechavi M, Dessimoz C.',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'Enabling semantic queries across federated bioinformatics databases',
                path: 'https://doi.org/10.1093/database/baz106',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: 'in ',
              },
              {
                type: 'text',
                content: 'Database, 2019, 2019:baz106.',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Mendes de Farias T, Stockinger H, Dessimoz C.',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'VoIDext: Vocabulary and Patterns for Enhancing Interoperable Datasets with Virtual Links',
                path: 'https://doi.org/10.1007/978-3-030-33246-4_38',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: 'in ',
              },
              {
                type: 'text',
                content:
                  'On the Move to Meaningful Internet Systems: OTM 2019 Conferences. Lecture Notes in Computer Science, 2019, 11877:607–625.',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'SIB Swiss Institute of Bioinformatics Members.',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'The SIB Swiss Institute of Bioinformatics\' resources: focus on curated databases',
                path: 'https://doi.org/10.1093/nar/gkv1310',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: 'in ',
              },
              {
                type: 'text',
                content:
                  'Nucleic Acids Research, 2016, 44:D27-D37.',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content:
                  'Bastian FB, Chibucos MC, Gaudet P, Giglio M, Holliday GL, Huang H, Lewis SE, Niknejad A, Orchard S, Poux S, Skunca N, Robinson-Rechavi M.',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'The Confidence Information Ontology: a step towards a standard for asserting confidence in annotations',
                path: 'https://doi.org/10.1093/database/bav043',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: 'in ',
              },
              {
                type: 'text',
                content: 'Database, 2015, 2015:bav043.',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Rosikiewicz M, Robinson-Rechavi M.',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'IQRray, a new method for Affymetrix microarray quality control, and the homologous organ conservation score, a new benchmark method for quality control metrics',
                path: 'https://doi.org/10.1093/bioinformatics/btu027',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: 'in ',
              },
              {
                type: 'text',
                content:
                  'Bioinformatics, 2014, 30:1392-1399.',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content:
                  'Niknejad A, Comte A, Parmentier G, Roux J, Bastian FB, Robinson-Rechavi M.',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'vHOG, a multispecies vertebrate ontology of homologous organs groups',
                path: 'https://doi.org/10.1093/bioinformatics/bts048',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: 'in ',
              },
              {
                type: 'text',
                content:
                  'Bioinformatics, 2012, 28:1017-1020.',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Roux J, Robinson-Rechavi M.',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'An ontology to clarify homology-related concepts',
                path: 'https://doi.org/10.1016/j.tig.2009.12.012',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: 'in ',
              },
              {
                type: 'text',
                content: 'Trends Genet, 2010, 26(3):99-102.',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content: 'Bastian F, Parmentier G, Robinson-Rechavi M.',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'Generating Homology Relationships by Alignment of Anatomical Ontologies',
                path: 'https://www.nature.com/articles/npre.2009.3546.1',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: 'in ',
              },
              {
                type: 'text',
                content: 'Nat Prec, 2009.',
              },
            ],
          },
          {
            type: 'rich_text',
            content: [
              {
                type: 'text',
                content:
                  'Bastian FB, Parmentier G, Roux J, Moretti S, Laudet V, Robinson-Rechavi M.',
              },
              {
                type: 'break_line',
              },
              {
                type: 'link_external',
                text: 'Bgee: Integrating and Comparing Heterogeneous Transcriptome Data Among Species',
                path: 'https://link.springer.com/chapter/10.1007/978-3-540-69828-9_12',
              },
              {
                type: 'break_line',
              },
              {
                type: 'italic',
                content: ' in ',
              },
              {
                type: 'text',
                content:
                  'DILS: Data Integration in Life Sciences. Lecture Notes in Computer Science, 2008, 5109:124-131. ',
              },
              {
                type: 'link_external',
                text: 'RIS',
                path: `${config.ftpDomain}/../general/citation01.ris`,
              },
            ],
          },
        ],
      },
    ],
  },
];
