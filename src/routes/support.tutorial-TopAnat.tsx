import { getMetadata } from '~/helpers/metadata';
import Markdown from '~/markdown/support/topAnat/topAnat.md';

export function meta() {
  return getMetadata({
    title: 'Bgee TopAnat tutorial',
    description: 'Bgee Tutorial about TopAnat Uberon enrichment analysis',
    keywords: 'Tutorial, enrichment analysis, Uberon',
  });
}

export default function Page() {
  return <Markdown />;
}
