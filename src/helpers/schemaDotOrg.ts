import config from '../config.json';
import PATHS from '../paths/paths';
import obolibraryLinkFromID, { obolibraryNCBITaxonLinkFromID } from './obolibraryLinkFromID';

// export const newsToLdJSON = ({ news, path }) => ({
//   '@context': 'https://schema.org/',
//   '@graph': news.map((item, index)=> {
//     return {
//       '@type': 'NewsArticle',
//       '@id': `${config.genericDomain}${path}#news${index}`,
//       // 'http://purl.org/dc/terms/conformsTo': {
//       //   '@id': 'https://bioschemas.org/profiles/Gene/1.0-RELEASE',
//       //   '@type': 'CreativeWork',
//       // },
//       datePublished: item.date,
//       // articleBody: item.markdown.toString(),
//     }
//   })
// });

export const topanatToLdJSON = (url: string, version: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'TopAnat - Gene Expression Enrichment',
  url: url,
  description:
    'GO-like enrichment of anatomical terms, mapped to genes by expression patterns. It is possible to run TopAnat using our BgeeDB R package. This is the same as this web-service, but with more flexibility in the choice of parameters and developmental stages, and is based on the topGO package.',
  applicationCategory: 'HealthApplication',
  genre: 'Gene expression analysis',
  offers: {
    '@type': 'Offer',
    price: 0,
  },
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  softwareVersion: version,
  softwareHelp: {
    '@type': 'CreativeWork',
    url: 'https://www.bgee.org/support/tutorial-TopAnat',
  },
  operatingSystem: 'All',
});

export const geneToLdJSON = ({ name, geneId, description, synonyms, species, xRefs, url }) => ({
  '@context': 'https://schema.org/',
  '@type': 'Gene',
  '@id': url,
  'http://purl.org/dc/terms/conformsTo': {
    '@id': 'https://bioschemas.org/profiles/Gene/1.0-RELEASE',
    '@type': 'CreativeWork',
  },
  description,
  alternateName: synonyms,
  identifier: geneId,
  name,
  subjectOf: {
    '@type': 'WebPage',
    url: url,
    name: `Gene: ${name} - ${geneId} - ${species.genus} ${species.speciesName}${
      species.name ? ` (${species.name})` : ''
    }`,
  },
  taxonomicRange: {
    '@type': 'Taxon',
    '@id': config.permanentVersionedDomain + PATHS.SEARCH.SPECIES_ITEM.replace(':id', species.id),
    name: `${species.genus} ${species.speciesName}${species.name ? ` (${species.name})` : ''}`,
    identifier: species.id,
    sameAs: obolibraryNCBITaxonLinkFromID(species.id),
  },
  sameAs: xRefs?.reduce((acc, a) => {
    if (a.xRefs.length === 1) acc.push(a.xRefs[0].xRefURL);
    return acc;
  }, []),
});

export const geneHomologsToLdJSON = (homo) => {
  return homo.map((h) => ({
    '@context': 'https://schema.org/',
    '@type': 'https://schema.org/Taxon',
    '@id': `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=${h.taxon.id}`,
    'http://purl.org/dc/terms/conformsTo': {
      '@id': 'https://bioschemas.org/profiles/Taxon/1.0-RELEASE',
      '@type': 'CreativeWork',
    },
    identifier: h.taxon.id,
    name: h.taxon.scientificName,
    alternateName: h.taxon.name,
  }));
};

export const geneExpressionToLdJSON = (genes, url: string) => {
  const ldJson: any[] = [];
  genes.forEach((g) => {
    const { anatEntity, cellType } = g.condition;
    if (g.condition.cellType)
      ldJson.push({
        '@context': 'https://schema.org/',
        '@type': 'Gene',
        '@id': url,
        expressedIn: {
          '@type': 'AnatomicalStructure',
          name: `${cellType.name} in ${anatEntity.name}`,
          subStructure: [
            {
              '@type': 'AnatomicalStructure',
              '@id': obolibraryLinkFromID(cellType.id),
              identifier: cellType.id,
              name: cellType.name,
            },
            {
              '@type': 'AnatomicalStructure',
              '@id': obolibraryLinkFromID(anatEntity.id),
              identifier: anatEntity.id,
              name: anatEntity.name,
            },
          ],
        },
      });
    else
      ldJson.push({
        '@context': 'https://schema.org/',
        '@type': 'Gene',
        '@id': url,
        expressedIn: {
          '@type': 'AnatomicalStructure',
          '@id': obolibraryLinkFromID(anatEntity.id),
          identifier: anatEntity.id,
          name: anatEntity.name,
        },
      });
  });
  return ldJson;
};

const fileDownloadProps = (file) => ({
  '@type': 'Dataset',
  'http://purl.org/dc/terms/conformsTo': {
    '@id': 'https://bioschemas.org/profiles/Dataset/1.0-RELEASE',
    '@type': 'CreativeWork',
  },
  dateModified: config.bioSchemaModifiedData,
  creator: {
    '@type': 'Organization',
    url: 'https://www.bgee.org/',
    name: 'The Bgee Team',
  },
  license: {
    '@type': 'CreativeWork',
    name: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  isAccessibleForFree: 'true',
  distribution: [
    {
      '@type': 'DataDownload',
      encodingFormat: 'TSV',
      contentUrl: file.path,
    },
  ],
});

export const datasetToLdJSON = () => {
  return {
    '@context': 'https://schema.org/',
    '@id': 'https://www.bgee.org/#schema-org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://www.bgee.org/about/team',
        name: 'Bgee - Bring Gene Expression Expertise',
        url: 'https://www.bgee.org/',
        description: 'The aim of Bgee is to help biologists to use and understand gene expression',
        logo: 'https://www.bgee.org/img/logo/bgee13_hp_logo.png',
        sameAs: [
          'https://bsky.app/profile/bgee.org',
          'https://genomic.social/@bgeedb',
          'https://www.linkedin.com/company/bgee/',
          'https://www.youtube.com/@bgeedatabase',
          'https://en.wikipedia.org/wiki/Bgee',
        ],
        parentOrganization: [
          {
            '@type': 'Organization',
            '@id': 'https://www.sib.swiss',
            name: 'SIB Swiss Institute of Bioinformatics',
            url: 'https://www.sib.swiss',
            sameAs: ['https://ror.org/002n09z45', 'https://en.wikipedia.org/wiki/Swiss_Institute_of_Bioinformatics'],
          },
          {
            '@type': 'CollegeOrUniversity',
            '@id': 'https://www.unil.ch',
            name: 'UNIL University of Lausanne',
            url: 'https://www.unil.ch',
            sameAs: ['https://ror.org/019whta54', 'https://en.wikipedia.org/wiki/University_of_Lausanne'],
          },
          {
            '@type': 'EducationalOrganization',
            '@id': 'https://www.unil.ch/dee/robinson-rechavi-group',
            name: 'Evolutionary Bioinformatics group',
            url: 'https://www.unil.ch/dee/robinson-rechavi-group',
          },
        ],
      },
      {
        '@type': 'Dataset',
        '@id': config.genericDomain,
        'http://purl.org/dc/terms/conformsTo': {
          '@id': 'https://bioschemas.org/profiles/Dataset/1.0-RELEASE',
          '@type': 'CreativeWork',
        },
        url: config.genericDomain,
        name: 'Bgee gene expression data',
        description:
          'Bgee is a database for retrieval and comparison of gene expression patterns across multiple animal species. It provides an intuitive answer to the question -where is a gene expressed?- and supports research in cancer and agriculture, as well as evolutionary biology.',
        keywords: [
          'bgee',
          'gene expression',
          'evolution',
          'ontology',
          'anatomy',
          'development',
          'evo-devo database',
          'anatomical ontology',
          'developmental ontology',
          'gene expression evolution',
        ],
        creator: {
          '@id': 'https://www.bgee.org/',
          '@type': 'Organization',
          url: 'https://www.bgee.org/',
          name: 'The Bgee Team',
        },
        citation: [
          {
            '@type': 'CreativeWork',
            name: 'The Bgee suite: integrated curated expression atlas and comparative transcriptomics in animals',
            headline: 'The Bgee suite: integrated curated expression atlas and comparative transcriptomics in animals',
            author: [
              {
                '@type': 'Person',
                givenName: 'Frederic',
                familyName: 'Bastian',
                identifier: 'https://orcid.org/0000-0002-9415-5104',
              },
              {
                '@type': 'Person',
                givenName: 'Julien',
                familyName: 'Roux',
                identifier: 'https://orcid.org/0000-0002-4192-5099',
              },
              {
                '@type': 'Person',
                givenName: 'Anne',
                familyName: 'Niknejad',
                identifier: 'https://orcid.org/0000-0003-3308-6245',
              },
              { '@type': 'Person', givenName: 'Aurelie', familyName: 'Comte' },
              {
                '@type': 'Person',
                givenName: 'Sara',
                familyName: 'Fonseca Costa',
                identifier: 'https://orcid.org/0000-0001-7794-7997',
              },
              {
                '@type': 'Person',
                givenName: 'Tarcisio',
                familyName: 'Mendes de Farias',
                identifier: 'https://orcid.org/0000-0002-3175-5372',
              },
              {
                '@type': 'Person',
                givenName: 'Sebastien',
                familyName: 'Moretti',
                identifier: 'https://orcid.org/0000-0003-3947-488X',
              },
              { '@type': 'Person', givenName: 'Gilles', familyName: 'Parmentier' },
              {
                '@type': 'Person',
                givenName: 'Valentine',
                familyName: 'Rech de Laval',
                identifier: 'https://orcid.org/0000-0002-3020-1490',
              },
              { '@type': 'Person', givenName: 'Marta', familyName: 'Rosikiewicz' },
              {
                '@type': 'Person',
                givenName: 'Julien',
                familyName: 'Wollbrett',
                identifier: 'https://orcid.org/0000-0002-3099-3117',
              },
              { '@type': 'Person', givenName: 'Amina', familyName: 'Echchiki' },
              { '@type': 'Person', givenName: 'Angelique', familyName: 'Escoriza' },
              {
                '@type': 'Person',
                givenName: 'Walid',
                familyName: 'Gharib',
                identifier: 'https://orcid.org/0000-0003-4831-8408',
              },
              {
                '@type': 'Person',
                givenName: 'Mar',
                familyName: 'Gonzalez-Porta',
                identifier: 'https://orcid.org/0000-0002-1661-7254',
              },
              { '@type': 'Person', givenName: 'Yohan', familyName: 'Jarosz' },
              { '@type': 'Person', givenName: 'Balazs', familyName: 'Laurenczy' },
              {
                '@type': 'Person',
                givenName: 'Philippe',
                familyName: 'Moret',
                identifier: 'https://orcid.org/0000-0002-3810-2091',
              },
              { '@type': 'Person', givenName: 'Emilie', familyName: 'Person' },
              { '@type': 'Person', givenName: 'Patrick', familyName: 'Roelli' },
              { '@type': 'Person', givenName: 'Komal', familyName: 'Sanjeev' },
              {
                '@type': 'Person',
                givenName: 'Mathieu',
                familyName: 'Seppey',
                identifier: 'https://orcid.org/0000-0003-3248-011X',
              },
              {
                '@type': 'Person',
                givenName: 'Marc',
                familyName: 'Robinson-Rechavi',
                identifier: 'https://orcid.org/0000-0002-3437-3329',
              },
            ],
            identifier: 'https://doi.org/10.1093/nar/gkaa793',
            sameas: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7778977/',
          },
          {
            '@type': 'CreativeWork',
            name: 'Bgee in 2024: focus on curated single-cell RNA-seq datasets, and query tools',
            headline: 'Bgee in 2024: focus on curated single-cell RNA-seq datasets, and query tools',
            author: [
              {
                '@type': 'Person',
                givenName: 'Frederic',
                familyName: 'Bastian',
                identifier: 'https://orcid.org/0000-0002-9415-5104',
              },
              {
                '@type': 'Person',
                givenName: 'Alessandro',
                familyName: 'Brandulas Cammarata',
                identifier: 'https://orcid.org/0009-0006-5956-9842',
              },
              {
                '@type': 'Person',
                givenName: 'Sara',
                familyName: 'Carsanaro',
                identifier: 'https://orcid.org/0009-0002-8634-7138',
              },
              {
                '@type': 'Person',
                givenName: 'Harald',
                familyName: 'Detering',
                identifier: 'https://orcid.org/0000-0002-0134-7618',
              },
              {
                '@type': 'Person',
                givenName: 'Wan-Ting',
                familyName: 'Huang',
                identifier: 'https://orcid.org/0009-0006-7191-2455',
              },
              {
                '@type': 'Person',
                givenName: 'Sagane',
                familyName: 'Joye',
                identifier: 'https://orcid.org/0000-0003-4771-6113',
              },
              {
                '@type': 'Person',
                givenName: 'Anne',
                familyName: 'Niknejad',
                identifier: 'https://orcid.org/0000-0003-3308-6245',
              },
              {
                '@type': 'Person',
                givenName: 'Marion',
                familyName: 'Nyamari',
                identifier: 'https://orcid.org/0000-0003-0004-9982',
              },
              {
                '@type': 'Person',
                givenName: 'Tarcisio',
                familyName: 'Mendes de Farias',
                identifier: 'https://orcid.org/0000-0002-3175-5372',
              },
              {
                '@type': 'Person',
                givenName: 'Sebastien',
                familyName: 'Moretti',
                identifier: 'https://orcid.org/0000-0003-3947-488X',
              },
              {
                '@type': 'Person',
                givenName: 'Marianna',
                familyName: 'Tzivanopoulou',
                identifier: 'https://orcid.org/0000-0001-6931-2879',
              },
              {
                '@type': 'Person',
                givenName: 'Julien',
                familyName: 'Wollbrett',
                identifier: 'https://orcid.org/0000-0002-3099-3117',
              },
              {
                '@type': 'Person',
                givenName: 'Marc',
                familyName: 'Robinson-Rechavi',
                identifier: 'https://orcid.org/0000-0002-3437-3329',
              },
            ],
            identifier: 'https://doi.org/10.1093/nar/gkae1118',
            sameas: 'https://pubmed.ncbi.nlm.nih.gov/39656924/',
          },
        ],
        license: {
          '@type': 'CreativeWork',
          name: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
          url: 'https://creativecommons.org/publicdomain/zero/1.0/',
        },
        isAccessibleForFree: 'true',
        version: config.version,
      },
    ],
  };
};

export const speciesToLdJSON = ({
  downloadFilesGroups: { downloadFiles },
  species: { genus, name, speciesName, id },
  url,
}) => {
  const json: any = {
    '@context': 'https://schema.org/',
    '@id': url,
    '@type': 'Taxon',
    'http://purl.org/dc/terms/conformsTo': {
      '@id': 'https://bioschemas.org/profiles/Taxon/1.0-RELEASE',
      '@type': 'CreativeWork',
    },
    name: `${genus} ${speciesName}`,
    identifier: id,
    sameAs: [
      obolibraryNCBITaxonLinkFromID(id),
      `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?lvl=0&id=${id}`,
      `https://nov2020.archive.ensembl.org/${genus}_${speciesName}`,
    ],
    taxonRank: [
      'https://rs.tdwg.org/ontology/voc/TaxonRank#Species',
      'https://purl.uniprot.org/core/Species',
      'https://purl.obolibrary.org/obo/NCBITaxon_species',
      'https://www.wikidata.org/entity/Q7432',
      'species',
    ],
    subjectOf: [
      {
        '@type': 'Dataset',
        dateModified: config.bioSchemaModifiedData,
        citation: '["https://doi.org/10.1093/nar/gkaa793","https://doi.org/10.1093/nar/gkae1118"]',
        description: `${genus} ${speciesName}${name ? ` (${name})` : ''} calls of presence/absence of expression. Each call corresponds to a unique combination of a gene, an anatomical entity, a life stage, a sex, and ${id === 9606 ? 'an ethnicity' : 'a strain'}, with reported presence or absence of expression.`,
        includedInDataCatalog: {
          '@id': config.genericDomain,
          '@type': 'DataCatalog',
          name: 'Bgee',
        },
        keywords: ['gene expression', 'call', `${genus} ${speciesName}`, name],
        creator: {
          '@type': 'Organization',
          url: 'https://www.bgee.org/',
          name: 'The Bgee Team',
        },
        license: {
          '@type': 'CreativeWork',
          name: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
          url: 'https://creativecommons.org/publicdomain/zero/1.0/',
        },
        isAccessibleForFree: 'true',
        name: `${genus} ${speciesName}${name ? ` (${name})` : ''} gene expression calls`,
        url: `${url}#expr-calls`,
        version: config.version,
        hasPart: [],
      },
      {
        '@type': 'Dataset',
        dateModified: config.bioSchemaModifiedData,
        creator: {
          '@type': 'Organization',
          url: 'https://www.bgee.org/',
          name: 'The Bgee Team',
        },
        citation: '["https://doi.org/10.1093/nar/gkaa793","https://doi.org/10.1093/nar/gkae1118"]',
        description: `Annotations and experiment information (e.g., annotations to anatomy and development, quality scores used in QCs, library information), and processed expression values (e.g., read counts, TPM and FPKM values) for ${genus} ${speciesName}.`,
        includedInDataCatalog: {
          '@id': config.permanentVersionedDomain,
          '@type': 'DataCatalog',
          name: 'Bgee',
        },
        keywords: [
          'annotations',
          'experiment information',
          'processed expression values',
          `${genus} ${speciesName}`,
          name,
        ],
        license: {
          '@type': 'CreativeWork',
          name: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
          url: 'https://creativecommons.org/publicdomain/zero/1.0/',
        },
        isAccessibleForFree: 'true',
        name: `${genus} ${speciesName}${name ? ` (${name})` : ''} processed expression values`,
        url: `${url}#proc-values`,
        version: config.version,
        hasPart: [],
      },
      {
        '@type': 'WebPage',
        url: `${url}`,
        name: `Species: ${genus} ${speciesName}${name ? ` (${name})` : ''}`,
      },
    ],
  };

  let callFile = downloadFiles.find((d) => d.category === 'expr_simple' && d.conditionParameters.length === 1);
  if (callFile) {
    json.subjectOf[0].hasPart.push({
      ...fileDownloadProps(callFile),
      name: `${genus} ${speciesName}${name ? ` (${name})` : ''} gene expression simple`,
      description: 'Anatomical entities only, file without advanced columns.',
      url: `${config.genericDomain + PATHS.SEARCH.SPECIES_ITEM.replace(':id', id)}#expr-calls-anat-simple`,
    });
  }
  callFile = downloadFiles.find((d) => d.category === 'expr_advanced' && d.conditionParameters.length === 1);
  if (callFile) {
    json.subjectOf[0].hasPart.push({
      ...fileDownloadProps(callFile),
      name: `${genus} ${speciesName}${name ? ` (${name})` : ''} gene expression advanced`,
      description: 'Anatomical entities only, file with advanced columns.',
      url: `${config.genericDomain + PATHS.SEARCH.SPECIES_ITEM.replace(':id', id)}#expr-calls-anat-advanced`,
    });
  }
  callFile = downloadFiles.find((d) => d.category === 'expr_simple' && d.conditionParameters.length > 1);
  if (callFile) {
    json.subjectOf[0].hasPart.push({
      ...fileDownloadProps(callFile),
      name: `${genus} ${speciesName}${name ? ` (${name})` : ''} gene expression simple with all conditions`,
      description: `Anatomical entities, developmental stages, sexes and ${id === 9606 ? 'ethnicities' : 'strains'}. File without advanced columns.`,
      url: `${config.genericDomain + PATHS.SEARCH.SPECIES_ITEM.replace(':id', id)}#expr-calls-cond-simple`,
    });
  }
  callFile = downloadFiles.find((d) => d.category === 'expr_advanced' && d.conditionParameters.length > 1);
  if (callFile) {
    json.subjectOf[0].hasPart.push({
      ...fileDownloadProps(callFile),
      name: `${genus} ${speciesName}${name ? ` (${name})` : ''} gene expression advanced with all conditions`,
      description: `Anatomical entities, developmental stages, sexes and ${id === 9606 ? 'ethnicities' : 'strains'}. File with advanced columns.`,
      url: `${config.genericDomain + PATHS.SEARCH.SPECIES_ITEM.replace(':id', id)}#expr-calls-cond-advanced`,
    });
  }

  let file = downloadFiles.find((d) => d.category === 'affy_annot');
  if (file) {
    json.subjectOf[1].hasPart.push({
      ...fileDownloadProps(file),
      name: `${genus} ${speciesName}${name ? ` (${name})` : ''} Affymetrix experiments chips`,
      keywords: ['Affymetrix'],
      description: 'Affymetrix experiments/chips annotations and metadata.',
      url: `${url}#proc-values-affymetrix`,
    });
  }
  file = downloadFiles.find((d) => d.category === 'affy_data');
  if (file) {
    json.subjectOf[1].hasPart.push({
      ...fileDownloadProps(file),
      name: `${genus} ${speciesName}${name ? ` (${name})` : ''} Affymetrix probesets`,
      description: `${genus} ${speciesName}${name ? ` (${name})` : ''} Affymetrix probesets, data (signal intensities).`,
      url: `${url}#proc-values-affymetrix`,
    });
  }

  file = downloadFiles.find((d) => d.category === 'rnaseq_annot');
  if (file) {
    json.subjectOf[1].hasPart.push({
      ...fileDownloadProps(file),
      name: `${genus} ${speciesName}${name ? ` (${name})` : ''} RNA-Seq experiment libraries`,
      keywords: ['RNA-Seq'],
      description: `${genus} ${speciesName}${name ? ` (${name})` : ''} RNA-Seq experiments/libraries annotations and metadata.`,
      url: `${url}#proc-values-rna-seq`,
    });
  }
  file = downloadFiles.find((d) => d.category === 'rnaseq_data');
  if (file) {
    json.subjectOf[1].hasPart.push({
      ...fileDownloadProps(file),
      name: `${genus} ${speciesName}${name ? ` (${name})` : ''} RNA-Seq read counts, TPM and FPKM`,
      description: `${genus} ${speciesName}${name ? ` (${name})` : ''} RNA-Seq read counts, TPM (Transcript Per Million) and FPKM (Fragments Per Kilobase of transcript per Million mapped reads).`,
      keywords: ['RNA-Seq'],
      url: `${url}#proc-values-rna-seq`,
    });
  }

  file = downloadFiles.find((d) => d.category === 'full_length_annot');
  if (file) {
    json.subjectOf[1].hasPart.push({
      ...fileDownloadProps(file),
      name: `${genus} ${speciesName}${name ? ` (${name})` : ''} Full length Single cell RNA-Seq experiment libraries`,
      description: `${genus} ${speciesName}${name ? ` (${name})` : ''} Full length Single cell RNA-Seq experiments/libraries annotations and metadata.`,
      keywords: ['scRNA-Seq', 'Single cell RNA-Seq', 'Full length RNA-Seq'],
      url: `${url}#proc-values-fl-scrna-seq`,
    });
  }
  file = downloadFiles.find((d) => d.category === 'full_length_data');
  if (file) {
    json.subjectOf[1].hasPart.push({
      ...fileDownloadProps(file),
      name: `${genus} ${speciesName}${name ? ` (${name})` : ''} Full length Single Cell RNA-Seq read counts, TPM and FPKM`,
      description: `${genus} ${speciesName}${name ? ` (${name})` : ''} Full length Single Cell RNA-Seq read counts, TPM (Transcript Per Million) and FPKM (Fragments Per Kilobase of transcript per Million mapped reads).`,
      keywords: ['scRNA-Seq', 'Single cell RNA-Seq', 'Full length RNA-Seq'],
      url: `${url}#proc-values-fl-scrna-seq`,
    });
  }
  file = downloadFiles.find((d) => d.category === 'full_length_h5ad');
  if (file) {
    json.subjectOf[1].hasPart.push({
      ...fileDownloadProps(file),
      name: `${genus} ${speciesName}${name ? ` (${name})` : ''} Full length Single Cell RNA-Seq processed H5AD data per cell (read counts)`,
      description: `${genus} ${speciesName}${name ? ` (${name})` : ''} Full length Single Cell RNA-Seq processed H5AD data per cell (read counts).`,
      keywords: ['scRNA-Seq', 'Single cell RNA-Seq', 'Full length RNA-Seq', 'H5AD'],
      url: `${url}#proc-values-fl-scrna-seq`,
      distribution: [{ '@type': 'DataDownload', encodingFormat: 'H5AD', contentUrl: file.path }],
    });
  }

  file = downloadFiles.find((d) => d.category === 'droplet_based_annot');
  if (file) {
    json.subjectOf[1].hasPart.push({
      ...fileDownloadProps(file),
      name: `${genus} ${speciesName}${name ? ` (${name})` : ''} Droplet based Single cell RNA-Seq experiment libraries`,
      description: `${genus} ${speciesName}${name ? ` (${name})` : ''} Droplet based Single cell RNA-Seq experiments/libraries annotations and metadata.`,
      keywords: ['scRNA-Seq', 'Single cell RNA-Seq', 'Droplet based RNA-Seq'],
      url: `${url}#proc-values-db-scrna-seq`,
    });
  }
  file = downloadFiles.find((d) => d.category === 'droplet_based_data');
  if (file) {
    json.subjectOf[1].hasPart.push({
      ...fileDownloadProps(file),
      name: `${genus} ${speciesName}${name ? ` (${name})` : ''} Droplet based Single Cell RNA-Seq UMI counts, CPM`,
      description: `${genus} ${speciesName}${name ? ` (${name})` : ''} Droplet based Single Cell RNA-Seq UMI counts, CPM (Counts Per Million).`,
      keywords: ['scRNA-Seq', 'Single cell RNA-Seq', 'Droplet based RNA-Seq'],
      url: `${url}#proc-values-db-scrna-seq`,
    });
  }
  file = downloadFiles.find((d) => d.category === 'droplet_based_h5ad');
  if (file) {
    json.subjectOf[1].hasPart.push({
      ...fileDownloadProps(file),
      name: `${genus} ${speciesName}${name ? ` (${name})` : ''} Droplet based Single Cell RNA-Seq processed H5AD data per cell (UMI counts)`,
      description: `${genus} ${speciesName}${name ? ` (${name})` : ''} Droplet based Single Cell RNA-Seq processed H5AD data per cell (UMI counts).`,
      keywords: ['scRNA-Seq', 'Single cell RNA-Seq', 'Droplet based RNA-Seq', 'H5AD'],
      url: `${url}#proc-values-db-scrna-seq`,
      distribution: [{ '@type': 'DataDownload', encodingFormat: 'H5AD', contentUrl: file.path }],
    });
  }

  return json;
};
