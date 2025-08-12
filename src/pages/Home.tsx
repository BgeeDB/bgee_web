import React from 'react';
import { Link } from 'react-router';

import assets, { heroCounts } from '../assets';
import PATHS from '../paths/paths';
import Bulma from '../components/Bulma';
import config from '../config.json';
import HomeNewsList from '../components/HomeNewsList';
import api from '../api';
import LinkExternal from '../components/LinkExternal';
import { datasetToLdJSON } from '../helpers/schemaDotOrg';
import imagePath from '../helpers/imagePath';
import Indexes from '../components/Indexes/Indexes';
import { getMetadata } from '~/helpers/metadata';

export async function loader() {
  try {
    const res = await api.search.species.list();
    return res.data;
  } catch (error) {
    console.warn('Error loading species list:', error);
    // throw new Response(error.data.message || error.message || 'Failed to load data from API', { status: 404 });
    return [];
  }
}

export function meta() {
  return getMetadata({
    schemaorg: [datasetToLdJSON()],
  });
}

const HomeCard = (props) => {
  const { id, imgUrl, title, desc, linkUrl, linkText } = props;
  return (
    <Bulma.C size={6}>
      <Bulma.Card id={id} className="mt-4 home-card">
        <Bulma.Card.Body>
          <h2 className="has-text-primary is-size-2">
            <Link to={linkUrl}>{title}</Link>
          </h2>
          <div className="content">
            <p>
              {desc}{' '}
              <Link to={linkUrl} className="home-card-link">
                {linkText}
              </Link>
            </p>
          </div>
        </Bulma.Card.Body>
        <div className="home-card-footer">
          <Bulma.Image className="no-responsive home-card-img" src={imagePath(imgUrl)} alt={`${title} screenshot`} />
        </div>
      </Bulma.Card>
    </Bulma.C>
  );
};

export default function Home({ loaderData }) {
  const { species: speciesList } = loaderData;

  React.useEffect(() => {
    // Add the class to the body element when the component mounts
    document.body.classList.add('homepage');
    // Clean up function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove('homepage');
    };
  }, []);

  return (
    <>
      <Bulma.Hero className="home-hero-banner">
        <Bulma.Hero.Body className="py-3">
          <p className="has-text-right has-text-white hero-version-number">
            <span>{`${config.archive ? 'Archived version' : 'Version'} ${config.fullversion}`}</span>
          </p>
          <Bulma.Columns>
            <Bulma.C size={6} className="my-auto">
              <Bulma.Title className="has-text-left has-text-weight-bold my-3" colorClassName="has-text-white">
                Discover gene expression data in animals
              </Bulma.Title>
              <p className="has-text-left is-size-4 has-text-white my-3">
                Bgee is a database for retrieval and comparison of gene expression patterns across multiple animal
                species. It provides an intuitive answer to the question &quot;where is a gene expressed?&quot; and
                supports research in cancer and agriculture, as well as evolutionary biology.
              </p>
              <div className="has-text-centered my-6 gene-search">
                <Link to={PATHS.SEARCH.GENE}>
                  <Bulma.C size={6} className="ic-dna">
                    <Bulma.Image src={assets.dnaIcon} alt="Icon DNA" style={{ width: '30px' }} />
                  </Bulma.C>
                  Gene search
                </Link>
              </div>
              <Bulma.Columns className="has-text-uppercase has-text-weight-bold is-size-6 has-text-white my-3 is-desktop hero-data-columns">
                <Bulma.C size={3}>
                  <div className="inner-hero-data-column">
                    <span>
                      comparable
                      <br />
                      species
                    </span>
                    <p className="is-size-2">{heroCounts.speciesCount}</p>
                  </div>
                </Bulma.C>
                <Bulma.C size={4}>
                  <div className="inner-hero-data-column">
                    <span>
                      bulk and single-cell
                      <br />
                      RNA-Seq libraries
                    </span>
                    <p className="is-size-2">{heroCounts.libraryCount}</p>
                  </div>
                </Bulma.C>
                <Bulma.C size={4}>
                  <div className="inner-hero-data-column">
                    <span>
                      unique annotated
                      <br />
                      conditions
                    </span>
                    <p className="is-size-2">{heroCounts.conditionCount}</p>
                  </div>
                </Bulma.C>
              </Bulma.Columns>
            </Bulma.C>

            <Bulma.C size={6} className="is-align-content-center">
              <Bulma.Image
                className="hero-image is-justify-content-flex-end"
                src={assets.heroImg}
                alt="Bgee hero illustration species and organs"
                style={{ width: '100%', maxWidth: '790px' }}
              />
            </Bulma.C>
          </Bulma.Columns>
        </Bulma.Hero.Body>
      </Bulma.Hero>

      <Bulma.Section className="quick-nav-cards">
        <Bulma.Columns className="has-text-uppercase has-text-weight-bold is-size-6 my-3 is-desktop hero-data-columns">
          <Bulma.C>
            <div className="inner">
              <a href="#card-gene-expression">Gene expression</a>
              <a href="#card-expression-comparison">Expression comparison</a>
              <a href="#card-expression-enrichment-analysis">Expression enrichment analysis</a>
              <a href="#card-raw-data-annotations">Curated annotations</a>
              <a href="#card-expression-calls">Expression calls</a>
              <a href="#card-data-retrieval">Data retrieval</a>
            </div>
          </Bulma.C>
        </Bulma.Columns>
      </Bulma.Section>

      <Bulma.Section className="home-cards">
        <Bulma.Columns>
          <HomeCard
            id="card-gene-expression"
            imgUrl="/home/gene_screenshot.webp"
            title="Gene expression"
            desc="Discover important details about your selected gene, including its expression in various conditions and its orthologs."
            linkUrl={PATHS.SEARCH.GENE}
            linkText="Gene search"
          />
          <HomeCard
            id="card-expression-comparison"
            imgUrl="/home/exp_comp_screenshot.webp"
            title="Expression comparison"
            desc="Compare gene expression for a list of genes in anatomical entities."
            linkUrl={PATHS.ANALYSIS.EXPRESSION_COMPARISON}
            linkText="Compare"
          />
          <HomeCard
            id="card-expression-enrichment-analysis"
            imgUrl="/home/topanat_screenshot.webp"
            title="Expression enrichment analysis"
            desc="Tool similar to a GO enrichment test but rather than using Gene Ontology annotations it is based on anatomical annotations."
            linkUrl={PATHS.ANALYSIS.TOP_ANAT}
            linkText="Analyse"
          />
          <HomeCard
            id="card-raw-data-annotations"
            imgUrl="/home/raw_data_annotations_screenshot.webp"
            title="Curated annotations"
            desc="Explore all libraries in Bgee that match your selected conditions and access their fully annotated raw (unprocessed) data."
            linkUrl={PATHS.SEARCH.RAW_DATA_ANNOTATIONS}
            linkText="Explore"
          />
          <HomeCard
            id="card-expression-calls"
            imgUrl="/home/expression_calls_screenshot.webp"
            title="Expression calls"
            desc="Search all present/absent gene expression calls in the Bgee database."
            linkUrl={PATHS.SEARCH.EXPRESSION_CALLS}
            linkText="Search"
          />

          <Bulma.C size={6}>
            <Bulma.Card className="mt-4 home-card" id="card-data-retrieval">
              <Bulma.Card.Body>
                <h2 className="is-size-2 has-text-primary">Data retrieval</h2>
                <div className="content">
                  <p>How to retrieve data.</p>
                  <Link to={PATHS.DOWNLOAD.GENE_EXPRESSION_CALLS} className="home-card-link">
                    Expression calls download files
                  </Link>
                  <Link to={PATHS.DOWNLOAD.PROCESSED_EXPRESSION_VALUES} className="home-card-link">
                    Expression values download files
                  </Link>
                  <Link to={PATHS.RESOURCES.R_PACKAGES} className="home-card-link">
                    R packages
                  </Link>
                  <Link to={PATHS.SEARCH.SPARQL} className="home-card-link">
                    SPARQL endpoint
                  </Link>
                </div>
              </Bulma.Card.Body>
              <div className="home-card-footer">
                <Bulma.Image
                  className="no-responsive home-card-img"
                  style={{ backgroundColor: 'white' }}
                  src={imagePath('/home/data_retrieval_screenshot.webp')}
                  alt="Data retrieval screenshot"
                />
              </div>
            </Bulma.Card>
          </Bulma.C>
        </Bulma.Columns>

        <Bulma.Card className="bgee-news">
          <HomeNewsList />
        </Bulma.Card>

        <Bulma.Card className="mt-6">
          <Indexes speciesList={speciesList} />
        </Bulma.Card>
      </Bulma.Section>

      <Bulma.Section className="bgee-resource-archive">
        <Bulma.Columns>
          <Bulma.C size={6} className="resource-container">
            <div className="resource-logos">
              <LinkExternal
                className="ext-as-int-link"
                to="https://globalbiodata.org/scientific-activities/global-core-biodata-resources"
              >
                <img
                  src={imagePath(`/logo/GCBR-Logo.png`)}
                  alt="Global Core Biodata Resource Logo"
                  width="165"
                  height="70"
                />
              </LinkExternal>
              <LinkExternal className="ext-as-int-link" to="https://elixir-europe.org/platforms/interoperability/rirs">
                <img
                  src={imagePath(`/logo/ELIXIR-rir-logo.png`)}
                  alt="ELIXIR Recommended Interoperability Resources Logo"
                  width="89"
                  height="70"
                />
              </LinkExternal>
            </div>
            <div className="resource-links">
              Bgee have been recognised as a&nbsp;
              <LinkExternal
                className="ext-as-int-link"
                to="https://globalbiodata.org/scientific-activities/global-core-biodata-resources"
              >
                Global Core Biodata Resource
              </LinkExternal>
              and an&nbsp;
              <LinkExternal className="ext-as-int-link" to="https://elixir-europe.org/platforms/interoperability/rirs">
                ELIXIR Recommended Interoperability Resource
              </LinkExternal>
            </div>
          </Bulma.C>
          <Bulma.C size={6}>
            {!config.archive && (
              <Bulma.C size={3}>
                View archive sites:
                <p className="is-size-7 archived-link">
                  {config.archivedVersion.map((archived) => (
                    <LinkExternal key={archived.version} to={archived.url}>
                      {`${archived.version}`}
                    </LinkExternal>
                  ))}
                </p>
              </Bulma.C>
            )}
          </Bulma.C>
        </Bulma.Columns>
      </Bulma.Section>
    </>
  );
}
