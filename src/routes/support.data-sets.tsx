import { getMetadata } from '~/helpers/metadata';
import Markdown from '~/markdown/support/datasets_of_interest.md';

export function meta() {
  return getMetadata({
    title: 'Datasets of interest',
    description:
      'Retrieve information about the datasets of special interest present in Bgee and how we integrated them.',
    keywords: 'Dataset, gene expression dataset, GTEx, Fly Cell Atlas, FCA, featured experiments, annotation',
  });
}

export default function Page() {
  return <Markdown />;
}
