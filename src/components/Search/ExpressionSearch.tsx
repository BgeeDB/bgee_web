import React from 'react';

const ExpressionSearch = ({ search, setSearch, elements, onRender }) => {
  const [showAuto, setShowAuto] = React.useState(false);
  const [prevSearch, setPrevSearch] = React.useState('');

  React.useEffect(() => {
    if (prevSearch !== search) {
      if (search !== '' && elements.length > 0) setShowAuto(true);
      setPrevSearch(search);
    }
    if (search === '') setShowAuto(false);
  }, [search, elements, prevSearch]);
  React.useEffect(() => {
    const clickOutside = () => {
      setShowAuto(false);
    };
    if (typeof document === 'undefined' || !document.getElementById('root')) {
      return () => {};
    }
    // TODO: this will probably need to be fixed a bit like we did AutoCompleteSearch (using ref and mousedown event)
    document?.getElementById('root')?.addEventListener('click', clickOutside);
    return () => {
      document?.getElementById('root')?.removeEventListener('click', clickOutside);
    };
  }, []);

  return (
    <div className="control">
      <input
        className="input"
        type="text"
        name="search-species"
        placeholder="Scientific name, common name, ..."
        value={search}
        onKeyDown={(e) => {
          if (e.key === 'Enter') setShowAuto(false);
        }}
        onChange={(e) => setSearch(e.target.value)}
      />
      {showAuto && (
        <div className="autocomplete-wrapper">
          {elements.map((s) =>
            typeof onRender === 'function'
              ? onRender(s, () => {
                  setShowAuto(false);
                })
              : null
          )}
        </div>
      )}
    </div>
  );
};

export default ExpressionSearch;
