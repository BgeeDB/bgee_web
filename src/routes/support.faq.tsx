import { getMetadata } from '~/helpers/metadata';
import Markdown from '~/markdown/support/FAQ.md';

export function meta() {
  return getMetadata({
    title: 'FAQ',
    description: 'Answers to Frequently Asked Questions',
    keywords: 'FAQ, Frequently Asked Questions',
  });
}

export default function Page() {
  return <Markdown />;
}
