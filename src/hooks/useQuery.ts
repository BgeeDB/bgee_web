import { useLocation } from 'react-router';

function useQuery(): URLSearchParams;
function useQuery(key: string): string | null;
function useQuery(key?: string): string | null | URLSearchParams {
  const loc = useLocation();
  const query = new URLSearchParams(loc.search);

  return key ? query.get(key) : query;
}

export default useQuery;
