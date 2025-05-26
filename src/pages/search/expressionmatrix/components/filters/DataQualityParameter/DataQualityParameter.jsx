import HelpIcon from '../../../../../../components/HelpIcon';
// import { ALL_DATA_QUALITIES } from '../../../../rawdata/useLogic';
import { ALL_DATA_QUALITIES } from '../../../useLogic';

const DataQualityParameter = ({ setDataQuality, dataQuality }) => {
  const onChange = (key) => {
    setDataQuality(key);
  };

  return (
    <div className="mt-4">
      <label>
        Data quality
        <HelpIcon
          style={{
            position: 'absolute',
          }}
          content={
            <>{`Select the minimum level of quality in support of the retrieved expression calls. Using the FDR-corrected p-values computed from your requested data types: PRESENT GOLD: FDR <= 0.01; PRESENT SILVER: FDR <= 0.05; PRESENT BRONZE: FDR > 0.05 in the condition of the call, but in at least one sub-condition FDR <= 0.05; ABSENT GOLD: FDR > 0.1, in the condition of the call, and in all its sub-conditions FDR > 0.05, true when considering all the requested data types, but also when considering only a subset of trusted data types (among RNA-Seq, Affymetrix, in situ hybridization); ABSENT SILVER: currently same as absent gold but displayed here to allow for modification in the future; ABSENT BRONZE: same as absent silver, except that the FDR is not greater than 0.1, or not greater than 0.05 in a sub-condition, when considering only a subset of trusted data types.`}</>
          }
        />
      </label>
      <div className="is-flex is-flex-wrap-wrap gene-expr-fields-wrapper mt-2">
        {ALL_DATA_QUALITIES.map((dq) => {
          const isSelected = dataQuality === dq.id;
          return (
            <label
              className="checkbox ml-2 is-size-7 is-flex is-align-items-center"
              key={dq.id}
            >
              <input
                type="radio"
                checked={isSelected}
                onChange={() => onChange(dq.id)}
              />
              <b className="mx-1">{dq.label}</b>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default DataQualityParameter;
