import type { MetaDescriptor } from 'react-router';

import config from '~/config.json';

/**
 * Generates metadata for the Bgee web application.
 *
 * This function creates an array of metadata objects for use with HTML meta tags,
 * including Open Graph tags, Dublin Core terms, and optional Schema.org JSON-LD.
 */
export function getMetadata({
  title = 'Bgee: gene expression data in animals',
  description = 'Bgee is a database for retrieval and comparison of gene expression patterns across multiple animal species. It provides an intuitive answer to the question -where is a gene expressed?- and supports research in cancer and agriculture, as well as evolutionary biology.',
  keywords = 'bgee, gene expression, evolution, ontology, anatomy, development, evo-devo database, anatomical ontology, developmental ontology, gene expression evolution',
  link = '',
  schemaorg = [],
  img = `${config.genericDomain}/img/logo/bgee13-logo.png`,
  logo = `${config.genericDomain}/img/logo/bgee13-logo.png`,
}: {
  title?: string;
  description?: string;
  keywords?: string;
  link?: string;
  schemaorg?: Array<{ [key: string]: any }>;
  img?: string;
  logo?: string;
}): MetaDescriptor[] {
  const metadata: MetaDescriptor[] = [
    { title: title },
    {
      property: 'og:title',
      content: title,
    },
    {
      name: 'description',
      content: description,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      name: 'keywords',
      content: keywords,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:site_name',
      content: 'Bgee',
    },
    {
      property: 'og:logo',
      content: logo,
    },
    {
      property: 'og:image',
      content: img,
    },

    // TODO: this is what was used originally, but I think it should be DC.rights https://datatracker.ietf.org/doc/html/rfc2731
    {
      name: 'dcterms.rights',
      content: `Bgee copyright 2007/${new Date().getFullYear()} SIB/UNIL`,
    },
  ];

  if (link) {
    metadata.push({
      property: 'og:url',
      content: link,
    });
    metadata.push({
      tagName: 'link',
      rel: 'canonical',
      href: link,
    });
  }

  // Add Schema.org structured data if provided
  for (const key in schemaorg) {
    metadata.push({
      'script:ld+json': schemaorg[key],
    });
  }
  return metadata;
}
