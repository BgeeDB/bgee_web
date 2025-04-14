import { getMetadata } from '~/helpers/metadata';
import Markdown from '~/markdown/support/sparql-tutorial/sparql-tutorial.md'

export function meta()  {
  return getMetadata({
    title: 'Bgee knowledge graph tutorial',
    description: 'Bgee Tutorial about knowledge graph',
    keywords: 'Tutorial, knowledge graph, RDF, SPARQL, gene-expression profile',
  })
};

export default function Page() {
  return <Markdown />;
}
