import { getMetadata } from '~/helpers/metadata';
import Markdown from '~/markdown/support/Download-files/affyProcExprValues.md';

export function meta() {
  return getMetadata({
    title: 'Bgee Affymetrix download file documentation: annotations and processed expression values tutorial',
    description:
      'Bgee Tutorial about Affymetrix download file documentation: annotations and processed expression values',
    keywords: 'Tutorial, Affymetrix, Download file, Processed expression values',
  });
}

export default function Page() {
  return <Markdown />;
}
