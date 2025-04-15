import { getMetadata } from '~/helpers/metadata';
import Markdown from '~/markdown/support/present_absent-expression-calls/Expression_call_search.md';

export function meta() {
  return getMetadata({
    title: 'Bgee expression calls tutorial',
    description: 'Bgee Tutorial about expression calls search',
    keywords: 'Tutorial, expression calls, search',
  });
}

export default function Page() {
  return <Markdown />;
}
