import config from '../config.json';

const APP_VERSION = config.version;
const URL_VERSION = APP_VERSION.replaceAll('.', '-');
const URL_ROOT = `${config.archive ? `/${URL_VERSION}` : ''}`;

const expressionPageHelper = {
  autocompleteSpecies: (list, kwList, search) =>
    list &&
    kwList &&
    list?.map &&
    list
      .map(s => ({
        info: s,
        word: kwList?.[s.id]?.find(kw => new RegExp(search, 'gi').test(kw)),
      }))
      ?.sort((a, b) => a?.word?.localeCompare(b.word)),
  autocompleteSpeciesRender: (setSearch, navigate) => (s, closeAutoComplete) => (
    // TODO: fix history to get location from args
    <div
      key={s.info.id}
      role="button"
      onClick={() => {
        setSearch(s.word);
        navigate(`${URL_ROOT}${history.location.pathname}?id=${s.info.id}`, { replace: true });
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
