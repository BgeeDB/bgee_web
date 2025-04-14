import { getMetadata } from '~/helpers/metadata';
import Markdown from '~/markdown/support/Raw-data-interface/Raw-data-interface.md'

export function meta() {
  return getMetadata({
    title: 'Bgee raw data interface tutorial',
    description: 'Bgee Tutorial about the raw data interface',
    keywords: 'Tutorial, raw data, experiments, libraries, processed expression values',
  });
}

export default function Page() {
  return <Markdown />;
}