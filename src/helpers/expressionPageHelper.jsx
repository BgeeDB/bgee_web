import { URL_ROOT } from '~/helpers/constants';

const expressionPageHelper = {
  autocompleteSpecies: (list, kwList, search) =>
    list &&
    kwList &&
    list?.map &&
    list
      .map((s) => ({
        info: s,
        word: kwList?.[s.id]?.find((kw) => new RegExp(search, 'gi').test(kw)),
      }))
      ?.sort((a, b) => a?.word?.localeCompare(b.word)),
  autocompleteSpeciesRender: (setSearch, navigate, location) => (s, closeAutoComplete) => (
    <div
      key={s.info.id}
      role="button"
      onClick={() => {
        setSearch(s.word);
        navigate(`${URL_ROOT}${location.pathname}?id=${s.info.id}`, { replace: true, preventScrollReset: true });
        setTimeout(() => {
          closeAutoComplete();
        }, 100);
      }}
    >
      {s.word}
    </div>
  ),
};

export default expressionPageHelper;
