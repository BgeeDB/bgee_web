import { getMetadata } from '~/helpers/metadata';
import Markdown from '~/markdown/support/expression-comparison/expression-comparison.md'

export function meta()  {
  return getMetadata({
    title: 'Bgee expression comparison tutorial',
    description: 'Bgee Tutorial about expression comparison of genes',
    keywords: 'Tutorial, expression comparison, genes',
  })
};

export default function Page() {
  return <Markdown />;
}
