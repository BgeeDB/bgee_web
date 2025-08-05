import { getMetadata } from '~/helpers/metadata';
import Markdown from '~/markdown/support/Download-files/rnaSeqProcExprValues.md';

export function meta() {
  return getMetadata({
    title: 'Bgee RNA-Seq download file documentation: annotations and processed expression values tutorial',
    description: 'Bgee Tutorial about RNA-Seq download file documentation: annotations and processed expression values',
    keywords: 'Tutorial, RNA-Seq, Download file, Processed expression values',
  });
}

export default function Page() {
  return <Markdown />;
}
