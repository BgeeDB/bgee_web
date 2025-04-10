import { useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import config from '../config.json';

const APP_VERSION = config.version;
const URL_VERSION = APP_VERSION.replaceAll('.', '-');
const URL_ROOT = `${config.archive ? `/${URL_VERSION}` : ''}`;

export const PARAM_PAGE_KEY = 'pageNumber';
export const RESULTS_COUNT_KEY = 'results';

export const usePaginationLink = (
  paginationParamPageKey,
  paginationResultCountKey
) => {
  const { pathname, search } = useLocation();
  const keyForPage = paginationParamPageKey || PARAM_PAGE_KEY;
  const keyForPageSize = paginationResultCountKey || RESULTS_COUNT_KEY;

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const generatePaginationLink = useCallback(
    (page, count) => {
      if (page < 1 || count < 0) {
        return '#';
      }

      const sp = Object.fromEntries(searchParams.entries());

      const newSp = new URLSearchParams({
        ...sp,
      });

      if (page) {
        newSp.set(keyForPage, page);
      }
      if (count) {
        newSp.set(keyForPageSize, count);
      }

      return `${URL_ROOT}${pathname}?${newSp.toString()}`;
    },
    [searchParams]
  );

  return { generatePaginationLink };
};

const usePagination = (
  perPage = 10,
  paginationParamPageKey = PARAM_PAGE_KEY,
  paginationResultCountKey = RESULTS_COUNT_KEY
) => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const keyForPage = paginationParamPageKey || PARAM_PAGE_KEY;
  const keyForPageSize = paginationResultCountKey || RESULTS_COUNT_KEY;

  const page = +(searchParams.get(keyForPage) || 1);
  const pageSize = +(searchParams.get(keyForPageSize) || perPage);

  const onPageChange = useCallback(
    (newPage) => {
      const sp = Object.fromEntries(searchParams.entries());
      const newParams = {
        ...sp,
        [keyForPage]: newPage,
      };
      navigate({
        search: new URLSearchParams(newParams).toString(),
        pathname: `${URL_ROOT}${pathname}`,
      });
    },
    [searchParams]
  );

  const onPageSizeChange = useCallback(
    (newPageSize) => {
      const sp = Object.fromEntries(searchParams.entries());
      const params = {
        ...sp,
        [keyForPageSize]: newPageSize,
        [keyForPage]: 1, // Always reset the page when page size is changed
      };
      navigate({
        search: new URLSearchParams(params).toString(),
        pathname: `${URL_ROOT}${pathname}`,
      });
    },
    [searchParams]
  );
  return { page, pageSize, onPageChange, onPageSizeChange };
};

export default usePagination;
