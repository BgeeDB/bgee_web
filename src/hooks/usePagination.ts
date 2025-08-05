import { useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';

import { URL_ROOT } from '~/helpers/constants';

export const PARAM_PAGE_KEY = 'pageNumber';
export const RESULTS_COUNT_KEY = 'results';

export const usePaginationLink = (paginationParamPageKey, paginationResultCountKey) => {
  const { pathname, search } = useLocation();
  const keyForPage = paginationParamPageKey || PARAM_PAGE_KEY;
  const keyForPageSize = paginationResultCountKey || RESULTS_COUNT_KEY;

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const generatePaginationLink = useCallback(
    (page: number, count: number = 0) => {
      if (page < 1 || count < 0) return '#';
      const sp = Object.fromEntries(searchParams.entries());
      const newSp = new URLSearchParams({
        ...sp,
      });
      if (page) newSp.set(keyForPage, page.toString());
      if (count) newSp.set(keyForPageSize, count.toString());
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
      navigate(
        {
          search: new URLSearchParams(newParams).toString(),
          pathname: `${URL_ROOT}${pathname}`,
        },
        { preventScrollReset: true }
      );
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
      navigate(
        {
          search: new URLSearchParams(params).toString(),
          pathname: `${URL_ROOT}${pathname}`,
        },
        { preventScrollReset: true }
      );
    },
    [searchParams]
  );
  return { page, pageSize, onPageChange, onPageSizeChange };
};

export default usePagination;
