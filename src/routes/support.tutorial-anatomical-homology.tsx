import { getMetadata } from '~/helpers/metadata';
import Markdown from '~/markdown/support/anatomical-homology/anatomical-homology.md';

export function meta() {
  return getMetadata({
    title: 'Bgee anatomical homology tutorial',
    description: 'Bgee Tutorial about anatomical homology',
    keywords: 'Tutorial, anatomical homology, tool, analysis, search',
  });
}

export default function Page() {
  return <Markdown />;
}
