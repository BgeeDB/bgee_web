import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import Bulma from '../Bulma';
import classnames from '../../helpers/classnames';
import api from '../../api';
import PATHS from '../../paths/paths';
import AutoCompleteSearch from '../AutoCompleteSearch/AutoCompleteSearch';

const GeneSearch = ({ classNames, children, searchTerm = '' }: any) => {
  const navigate = useNavigate();

  const renderOption = useCallback((option, search) => {
    let redPart;
    let firstPart;
    let lastPart;

    if (search) {
      const firstIndex = option.indexOf(search);
      if (firstIndex === 0) {
        redPart = option.substring(firstIndex, search.length);
        lastPart = option.substring(search.length, option.length);
      } else {
        firstPart = option.substring(0, firstIndex);
        redPart = option.substring(firstIndex, search.length + 1);
        lastPart = option.substring(search.length + 1, option.length);
      }
    }
    return (
      <span>
        {firstPart}
        <strong className="has-text-primary">{redPart}</strong>
        {lastPart}
      </span>
    );
  }, []);

  const getOptionsFunction = useCallback(async search => {
    if (search) {
      return api.search.genes.autoComplete(search).then((resp: any) => {
        if (resp.code === 200 && resp.data.matchCount !== 0) {
          return resp.data.match;
        }
        return [];
      });
    }
    return [];
  }, []);

  const onSelectOption = useCallback(
    option => {
      navigate(`${PATHS.SEARCH.GENE}?search=${option}`);
    },
    [navigate]
  );

  return (
    <Bulma.Card className={classnames(classNames, 'form')}>
      <Bulma.Card.Body>
        <AutoCompleteSearch
          label="Search Genes"
          hasSearchButton
          searchTerm={searchTerm}
          placeholder="Examples: dlx, ENSG00000254647"
          renderOption={renderOption}
          getOptionsFunction={getOptionsFunction}
          onSelectOption={onSelectOption}
        >
          {children}
        </AutoCompleteSearch>
      </Bulma.Card.Body>
    </Bulma.Card>
  );
};

export default GeneSearch;
