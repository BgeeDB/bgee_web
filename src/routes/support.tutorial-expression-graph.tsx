import { getMetadata } from '~/helpers/metadata';
import Markdown from '~/markdown/support/expression-graph/Tutorial_expression_graph.md';

export function meta() {
  return getMetadata({
    title: 'Bgee expression graph tutorial',
    description: 'Bgee Tutorial about expression graph',
    keywords: 'Tutorial, expression graph',
  });
}

export default function Page() {
  return <Markdown />;
}
