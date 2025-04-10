import React from 'react';
import config from '../../config.json';
import api from '../../api';
import Bulma from '../../components/Bulma';
import { FULL_LENGTH_LABEL } from '../../api/prod/constant';

const CATEGORIES = [
  {
    key: 'GENOMICS',
    title: 'Genomics databases',
  },
  {
    key: 'PROTEOMICS',
    title: 'Proteomics databases',
  },
  {
    key: 'SC_RNA_SEQ',
    title: `${FULL_LENGTH_LABEL} data sources`,
  },
  {
    key: 'RNA_SEQ',
    title: 'RNA-Seq data sources',
  },
  {
    key: 'AFFYMETRIX',
    title: 'Affymetrix data sources',
  },
  {
    key: 'IN_SITU',
    title: 'In situ data sources',
  },
  {
    key: 'EST',
    title: 'EST data sources',
  },
  {
    key: 'ONTOLOGY',
    title: 'Ontologies',
  },
  {
    key: 'NONE',
    title: 'Other sources',
  },
];
const DataSource = () => {
  const [loading, setLoading] = React.useState(false);
  const [sources, setSources] = React.useState({});
  React.useEffect(() => {
    setLoading(true);
    api.get
      .dataSources()
      .then(({ data }) => {
        const categories = new Set();
        data.sources.forEach((s) => {
          categories.add(s.category);
        });
        const categorizedSources = {};
        categories.forEach((category) => {
          categorizedSources[category] = data.sources.filter(
            (s) => s.category === category
          );
        });
        setSources(categorizedSources);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="content has-text-centered">
        <Bulma.Title className="title is-3">Data sources</Bulma.Title>
      </div>
      <p className="">
        This page provides information about the data sources used in Bgee{' '}
        {config.version}.
      </p>
      {loading && (
        <progress
          className="progress is-small"
          max="100"
          style={{ animationDuration: '3s', marginBottom: 12 }}
        >
          80%
        </progress>
      )}
      {CATEGORIES.map((c) =>
        sources[c.key] ? (
          <React.Fragment key={c.key}>
            <Bulma.Title
              className="gradient-underline title is-size-4 has-text-primary"
              renderAs="h2"
            >
              {c.title}
            </Bulma.Title>
            {sources[c.key].map((s, key) => (
              <React.Fragment key={s.id}>
                <div className="columns mt-2">
                  <div className="column is-2">
                    <p className="">
                      <a
                        href={s.baseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="external-link"
                      >
                        {s.name}
                      </a>
                    </p>
                  </div>
                  <div className="column is-10">
                    <div className="columns mb-0">
                      <div className="column is-2">
                        <p className="">DESCRIPTION</p>
                      </div>
                      <div className="column is-10">
                        <p className="">{s.description}</p>
                      </div>
                    </div>
                    <div className="columns">
                      <div className="column is-2">
                        <p className="">LAST IMPORT</p>
                      </div>
                      <div className="column is-10">
                        <p className="">
                          {s.releaseDate}
                          {s.releaseVersion !== '' &&
                            ` (release ${s.releaseVersion})`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {key + 1 < sources[c.key].length && (
                  <div className="separator" />
                )}
              </React.Fragment>
            ))}
          </React.Fragment>
        ) : null
      )}
    </>
  );
};

export default DataSource;
