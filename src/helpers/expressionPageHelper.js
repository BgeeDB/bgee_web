/* eslint-disable react/destructuring-assignment,jsx-a11y/interactive-supports-focus,react/no-array-index-key,react/button-has-type,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions,jsx-a11y/label-has-associated-control */
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
      .map((s) => ({
        info: s,
        word: kwList?.[s.id]?.find((kw) => new RegExp(search, 'gi').test(kw)),
      }))
      ?.sort((a, b) => a?.word?.localeCompare(b.word)),
  autocompleteSpeciesRender: (setSearch, history) => (s, closeAutoComplete) =>
    (
      <div
        key={s.info.id}
        role="button"
        onClick={() => {
          setSearch(s.word);
          history.replace(`${URL_ROOT}${history.location.pathname}?id=${s.info.id}`);
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
