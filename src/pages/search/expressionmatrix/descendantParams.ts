// "Including substructures" on the expression matrix.
// Missing means the form default (include substructures). true/1 and false/0 are explicit.

export const ANAT_ENTITY_DESCENDANT_PARAM = 'anat_entity_descendant';
export const CELL_TYPE_DESCENDANT_PARAM = 'cell_type_descendant';

const DESCENDANT_PAGE_PARAMS = [ANAT_ENTITY_DESCENDANT_PARAM, CELL_TYPE_DESCENDANT_PARAM] as const;

export const descendantFlagFromValue = (value: unknown): boolean | null => {
  if (typeof value === 'boolean') return value;
  if (value == null) return null;
  const normalized = String(value).trim().toLowerCase();
  if (normalized === 'true' || normalized === '1') return true;
  if (normalized === 'false' || normalized === '0') return false;
  return null;
};

type ParamSource = URLSearchParams | Record<string, unknown> | null | undefined;

export const descendantFlagFromParams = (params: ParamSource, key: string): boolean | null => {
  if (!params) return null;
  if (typeof (params as URLSearchParams).getAll === 'function') {
    const values = (params as URLSearchParams).getAll(key).filter((value) => value !== '');
    if (values.length === 0) return null;
    return descendantFlagFromValue(values[0]);
  }
  const raw = (params as Record<string, unknown>)[key];
  if (Array.isArray(raw)) return raw.length === 0 ? null : descendantFlagFromValue(raw[0]);
  return descendantFlagFromValue(raw);
};

// An explicit page param wins. A data hash may still carry the flag when the page URL does not.
export const copyMissingDescendantFlags = (target: URLSearchParams, source: ParamSource) => {
  DESCENDANT_PAGE_PARAMS.forEach((key) => {
    if (target.has(key)) return;
    const flag = descendantFlagFromParams(source, key);
    if (flag === null) return;
    target.set(key, flag ? 'true' : 'false');
  });
};

// The default (include substructures) is omitted. An opt-out stays on the page URL,
// because a search that turns the option off is not otherwise visible next to the data hash.
export const applyDescendantPageParams = (
  searchParams: URLSearchParams,
  includeTissueSubstructures: boolean,
  includeCellTypeSubstructures: boolean
) => {
  const write = (key: string, includeSubstructures: boolean) => {
    if (includeSubstructures) searchParams.delete(key);
    else searchParams.set(key, 'false');
  };
  write(ANAT_ENTITY_DESCENDANT_PARAM, includeTissueSubstructures);
  write(CELL_TYPE_DESCENDANT_PARAM, includeCellTypeSubstructures);
};
