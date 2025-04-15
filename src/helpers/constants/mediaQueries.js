/* eslint-disable import/prefer-default-export */

export const MEDIA_QUERIES = {
  DESKTOP_HOMOLOGS: 'desktop-homologs',
  DESKTOP: 'desktop',
  TABLET: 'tablet',
  MOBILE_L: 'mobile-l',
  MOBILE_P: 'mobile-p',
};

export const MEDIA_QUERIES_SIZE = {
  [MEDIA_QUERIES.DESKTOP_HOMOLOGS]: 1180,
  [MEDIA_QUERIES.DESKTOP]: 960,
  [MEDIA_QUERIES.TABLET]: 850,
  [MEDIA_QUERIES.MOBILE_L]: 480,
  [MEDIA_QUERIES.MOBILE_P]: 320,
};

export const isHideMediaQuery = (windowWidth, mediaQuery) =>
  !!(
    mediaQuery &&
    ((MEDIA_QUERIES_SIZE[mediaQuery] && windowWidth <= MEDIA_QUERIES_SIZE[mediaQuery]) ||
      (typeof mediaQuery === 'number' && windowWidth <= mediaQuery))
  );
export const hasColumnsTableHidden = (windowWidth, columns) => {
  for (let i = 0; Array.isArray(columns) && i < columns.length; i += 1) {
    if (
      columns[i].hide &&
      ((MEDIA_QUERIES_SIZE[columns[i].hide] && windowWidth <= MEDIA_QUERIES_SIZE[columns[i].hide]) ||
        (typeof columns[i].hide === 'number' && windowWidth <= columns[i].hide))
    )
      return true;
  }

  return false;
};
