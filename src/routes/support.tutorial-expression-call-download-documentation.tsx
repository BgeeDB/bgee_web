import { getMetadata } from '~/helpers/metadata';
import Markdown from '~/markdown/support/Download-files/geneExpression.md'

export function meta()  {
  return getMetadata({
    title: 'Bgee Expression call download file documentation tutorial',
    description: 'Bgee Tutorial about Expression call download file documentation',
    keywords: 'Tutorial, Download file, Expression call',
  })
};

export default function Page() {
  return <Markdown />;
}
