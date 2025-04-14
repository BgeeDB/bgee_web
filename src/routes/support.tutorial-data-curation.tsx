import { getMetadata } from '~/helpers/metadata';
import Markdown from '~/markdown/support/data-curation/data-curation.md'

export function meta()  {
  return getMetadata({
    title: 'Bgee data curation tutorial',
    description: 'Bgee Tutorial about data curation and annotation',
    keywords: 'Tutorial, data curation, annotation',
  })
};

export default function Page() {
  return <Markdown />;
}
