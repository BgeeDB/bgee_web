import { getMetadata } from '~/helpers/metadata';
import Markdown from '~/markdown/support/scRNA-seq_Protocols.md';

export function meta() {
  return getMetadata({
    title: 'Single-cell RNA Sequencing (scRNA-Seq) Protocols: A Comparative Guide',
    description: 'Single-cell RNA Sequencing (scRNA-Seq) Protocols: A Comparative Guide',
    keywords: 'Single-cell RNA Sequencing, scRNA-Seq, protocols, Comparative Guide',
  });
}

export default function Page() {
  return <Markdown />;
}
