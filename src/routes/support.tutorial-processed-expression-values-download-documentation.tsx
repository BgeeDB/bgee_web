import { getMetadata } from '~/helpers/metadata';
import Markdown from '~/markdown/support/Download-files/procExprValFile.md'

export function meta()  {
  return getMetadata({
    title: 'Bgee Processed expression values download file documentation tutorial',
    description: 'Bgee Tutorial about Processed expression values download file documentation',
    keywords: 'Tutorial, Download file, Processed expression values',
  })
};

export default function Page() {
  return <Markdown />;
}
