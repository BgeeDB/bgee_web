import { getMetadata } from '~/helpers/metadata';
import Markdown from '~/markdown/support/Download-files/scRNASeqFLProcExprValues.md'

export function meta()  {
  return getMetadata({
    title: 'Bgee Single cell RNA-Seq full-length download file documentation: annotations and processed expression values tutorial',
    description: 'Bgee Tutorial about Single cell RNA-Seq full-length download file documentation: annotations and processed expression values',
    keywords: 'Tutorial, Single cell RNA-Seq full-length, scRNA-seq full-length, Download file, Processed expression values',
  })
};

export default function Page() {
  return <Markdown />;
}
