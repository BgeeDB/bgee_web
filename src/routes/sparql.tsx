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
      {isMounted && (
        // @ts-expect-error Property 'sparql-editor' does not exist on type 'JSX.IntrinsicElements'
        <sparql-editor endpoint="https://www.bgee.org/sparql/"></sparql-editor>
      )}
    </>
  );
}
