import HelpIcon from '../../../../../../components/HelpIcon';

const OnlyPropagated = ({ onlyPropagated, setOnlyPropagated }) => (
  <>
  <label className="labelWithHelpIcon">
        <span>Data integration</span>
        <HelpIcon
          style={{
            height: '21px',
          }}
          content={
            <>
              Processed expression values can be propagated along a graph of conditions in 
              order to generate propagated calls. Some raw data have not been used to generate
              the propagated calls. By checking this checkbox you will retrieve only raw data used to
              generate the propagated calls. This option is useful to retrieve raw data used to generate
              one call. It should not be checked if you are only interested in raw data.
            </>
          }
        />
      </label>
    <div className="checkboxWrapper">
        <input
          id="onlyPropagated"
          type="checkbox"
          checked={onlyPropagated ? 'checked' : ''}
          onChange={() => setOnlyPropagated((value) => !value)}
        />
        <label htmlFor="onlyPropagated">Used in gene expression calls</label>
        
    </div>
    </>
);

export default OnlyPropagated;

