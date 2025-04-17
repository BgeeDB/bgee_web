import { getMetadata } from '~/helpers/metadata';
import RawDataAnnotations from '~/pages/search/rawdata/RawDataAnnotations';

export function meta() {
  return getMetadata({
    title: 'Present/absent expression calls',
    description: 'Search for Present/absent expression calls',
    keywords: 'Present, absent, expression calls',
  });
}

export default function ExpressionCalls() {
  return <RawDataAnnotations isExprCalls />;
}
