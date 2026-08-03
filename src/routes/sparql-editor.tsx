import { useState, useEffect } from 'react';
import { getMetadata } from '~/helpers/metadata';
// import '@sib-swiss/sparql-editor';
// Internal server error: self is not defined
// at file:///Users/vemonet/dev/bgee/bgee_web/node_modules/node_modules/@zazuko/yasgui/build/yasgui.min.js:2:203

export function meta() {
  return getMetadata({
    title: 'SPARQL editor for Bgee',
    description: 'SPARQL editor for the Bgee endpoint',
    keywords: 'SPARQL endpoint, gene expression',
  });
}

export default function Page() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Only import the component on the client side, web components break in SSR
    import('@sib-swiss/sparql-editor');
    setIsMounted(true);
  }, []);

  return (
    <>
      <div className="content has-text-centered">
        <h1 className="title is-3">Bgee SPARQL editor</h1>
      </div>
      <div style={{ textAlign: 'center', overflow: 'hidden', marginTop: '1rem', fontWeight: 'bold' }}>
        Bgee SPARQL endpoint: <code>https://www.bgee.org/sparql/</code>
      </div>
      {isMounted && <sparql-editor endpoint="https://www.bgee.org/sparql/"></sparql-editor>}
      <div style={{ textAlign: 'center', overflow: 'hidden', marginTop: '2rem' }}>
        <ul>
          <li>
            Tutorial and documentation:{' '}
            <a href="https://purl.org/sib-rdf/bgee-tutorial">Querying the Bgee knowledge graph</a>
          </li>
          <li>
            Ontology [data schema]:{' '}
            <a href="https://purl.org/genex/documentation">GenEx semantic model specification</a>
          </li>
          <li>
            Support: <a href="https://github.com/BgeeDB/bgee_pipeline/issues">open an issue here</a>
          </li>
        </ul>
      </div>
    </>
  );
}
