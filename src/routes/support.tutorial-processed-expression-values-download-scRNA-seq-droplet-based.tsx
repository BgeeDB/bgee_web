import { getMetadata } from '~/helpers/metadata';
import Markdown from '~/markdown/support/Download-files/scRNASeqTBProcExprValues.md';

export function meta() {
  return getMetadata({
    title: 'Bgee Droplet-based scRNA-seq Data in H5AD Format tutorial',
    description: 'Bgee Tutorial about Droplet-based scRNA-seq Data in H5AD Format',
    keywords:
      'Tutorial, Single cell RNA-Seq Droplet-based, scRNA-seq Droplet-based, Single cell RNA-Seq target-based, scRNA-seq target-based, Download file, Processed expression values, H5AD',
  });
}

export default function Page() {
  return <Markdown />;
}
