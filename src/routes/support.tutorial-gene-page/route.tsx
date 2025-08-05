import { getMetadata } from '~/helpers/metadata';
import Markdown from './tutorial-gene-page.md';

export function meta() {
  return getMetadata({
    title: 'Bgee gene page tutorial',
    description: 'Bgee Tutorial about gene search and gene page',
    keywords: 'Tutorial, gene, search',
  });
}

export default function Page() {
  return <Markdown />;
}
