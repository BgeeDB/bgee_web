import { TOP_ANAT_FLOW } from '../../hooks/useTopAnat';
import GaEvent from '../GaEvent/GaEvent';
import PATHS from '../../routes/paths';

const TopAnatActionButtons = ({
  status,
  handleSubmit,
  cancelJob,
  startNewJob,
  jobId,
  isDisabled = false,
  data,
}) => {
  switch (status) {
    case TOP_ANAT_FLOW.NEW_JOB:
      return (
        <div className="field">
          <p className="control">
            <button
              type="button"
              className="button is-info"
              disabled={data.genes === '' || isDisabled}
              onClick={handleSubmit}
            >
              Submit your job
            </button>
          </p>
        </div>
      );
    case TOP_ANAT_FLOW.GETTING_JOB:
    case TOP_ANAT_FLOW.GOT_JOB:
      return (
        <>
          <div className="field is-grouped">
            <p className="control">
              <GaEvent category="Top Anat" action="cancelJob" label={jobId}>
                <button
                  type="button"
                  className="button is-danger"
                  onClick={cancelJob}
                >
                  Cancel your job
                </button>
              </GaEvent>
            </p>
            <p className="control">
              <a
                className="button is-info"
                href={PATHS.ANALYSIS.TOP_ANAT}
                target="_blank"
                rel="noopener noreferrer"
              >
                Start a new job
              </a>
            </p>
          </div>
        </>
      );
    case TOP_ANAT_FLOW.ERROR_LAUNCH_JOB:
    case TOP_ANAT_FLOW.ERROR_GET_JOB:
    case TOP_ANAT_FLOW.ERROR_GET_RESULTS:
    case TOP_ANAT_FLOW.GOT_RESULTS:
      return (
        <div className="field">
          <p className="control">
            <button
              type="button"
              className="button is-info"
              onClick={startNewJob(false)}
            >
              Start a new job
            </button>
          </p>
        </div>
      );
    default:
      return null;
  }
};

export default TopAnatActionButtons;
