import config from '~/config.json';
import type { MetaDescriptor } from 'react-router';

/**
 * Generates metadata for the Bgee web application.
 *
 * This function creates an array of metadata objects for use with HTML meta tags,
 * including Open Graph tags, Dublin Core terms, and optional Schema.org JSON-LD.
 *
 * @param {Object} options - Configuration options for the metadata.
 * @param {string} [options.title] - The title of the page.
 * @param {string} [options.description] - The description of the page.
 * @param {string} [options.keywords=] - Keywords for the page, comma-separated.
 * @param {string} [options.link] - The canonical URL of the page, used for og:url.
 * @param {Array<Object>} [options.schemaorg] - A list of JSON-LD scripts to add to the page for Schema.org structured data.
 * @returns {MetaDescriptor[]} An array of metadata objects to be rendered as meta tags.
 */
export function getMetadata({
  title = 'Bgee: gene expression data in animals',
  description = 'Bgee is a database for retrieval and comparison of gene expression patterns across multiple animal species. It provides an intuitive answer to the question -where is a gene expressed?- and supports research in cancer and agriculture, as well as evolutionary biology.',
  keywords = 'bgee, gene expression, evolution, ontology, anatomy, development, evo-devo database, anatomical ontology, developmental ontology, gene expression evolution',
  link = '',
  schemaorg = [],
}: {
  title?: string;
  description?: string;
  keywords?: string;
  link?: string;
  schemaorg?: Array<{ [key: string]: any }>;
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
      content: `${config.genericDomain}/img/logo/bgee13-logo.png`,
    },
    {
      property: 'og:image',
      content: `${config.genericDomain}/img/logo/bgee13-logo.png`,
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
      'script:ld+json': JSON.stringify(schemaorg[key]),
    });
  }
  return metadata;
}
