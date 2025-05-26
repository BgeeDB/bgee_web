/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// import { COND_PARAM2_SEX_KEY } from '../../../../rawdata/useLogic';
import { COND_PARAM2_SEX_KEY } from '../../../../rawdata/useLogic';

const Sex = ({
  speciesSexes,
  selectedSexes,
  toggleSex,
  addConditionalParam,
}) => {
  const onSelect = (name) => {
    toggleSex(name);
    addConditionalParam(COND_PARAM2_SEX_KEY);
  };

  return (
    <>
      <label className="labelWithHelpIcon">
        <span>Sex</span>
      </label>
      <div className="sex-container">
        {speciesSexes.map((sex) => {
          const isChecked = selectedSexes.indexOf(sex.name) !== -1;
          return (
            <div id={sex.name} key={sex.name} className="sex-input-name">
              <input
                onChange={() => onSelect(sex.name)}
                type="checkbox"
                checked={isChecked ? 'checked' : ''}
              />
              <label
                onClick={() => onSelect(sex.name)}
                htmlFor={sex.name}
                className="sex-name"
              >
                {sex.name}
              </label>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Sex;
