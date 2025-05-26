/* eslint-disable import/no-useless-path-segments */
/* eslint-disable import/named */
import HelpIcon from '../../../../../../components/HelpIcon';
import { ALL_CALL_TYPE } from '../../../useLogic';

const CallType = ({ callTypes = [], setCallTypes }) => {
  const onChangeCallType = (e, id) => {
    setCallTypes((prev) => {
      const curr = [...prev];
      if (e.target.checked) {
        curr.push(id);
      } else {
        const pos = curr.findIndex((d) => d === id);
        if (pos >= 0) curr.splice(pos, 1);
      }
      return curr;
    });
  };

  return (
    <>
      <label>
        Call type
        <HelpIcon
          style={{
            position: 'absolute',
          }}
          content={
            <>
              Retrieve present expression calls, indicating significant
              expression of a gene in a condition, and/or absent expression
              calls, indicating reported absence of expression of a gene in a
              condition.
            </>
          }
        />
      </label>
      <div className="is-flex is-flex-wrap-wrap gene-expr-fields-wrapper mt-2">
        {ALL_CALL_TYPE.map((ct) => (
          <label
            key={ct.id}
            className="checkbox ml-2 is-size-7 is-flex is-align-items-center"
            id={ct.id}
          >
            <input
              type="checkbox"
              checked={!!callTypes.find((d) => d === ct.id) || false}
              onChange={(e) => onChangeCallType(e, ct.id)}
            />
            <b className="mx-1">{ct.label}</b>
          </label>
        ))}
      </div>
    </>
  );
};

export default CallType;
