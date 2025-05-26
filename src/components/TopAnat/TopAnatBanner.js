/* eslint-disable no-case-declarations */
import { useEffect, useRef } from 'react';
import Bulma from '../Bulma';
import isPlural from '../../helpers/isPlural';
import { TOP_ANAT_FLOW } from '../../hooks/useTopAnat';

const TopAnatBanner = ({ results, status }) => {
  const refLaunching = useRef();
  const refGotJob = useRef();
  const refGotResult = useRef();

  useEffect(() => {
    if (refGotResult?.current) {
      setTimeout(() => {
        refGotResult.current?.scrollIntoView({
          behavior: 'smooth',
        });
      }, 50);
    } else if (refGotJob?.current) {
      setTimeout(() => {
        refGotJob.current?.scrollIntoView({
          behavior: 'smooth',
        });
      }, 50);
    } else if (refLaunching?.current) {
      setTimeout(() => {
        refLaunching.current?.scrollIntoView({
          behavior: 'smooth',
        });
      }, 50);
    }
  }, [status, refLaunching, refGotJob, refGotResult]);

  switch (status) {
    case TOP_ANAT_FLOW.LOADING:
    case TOP_ANAT_FLOW.GETTING_JOB:
    case TOP_ANAT_FLOW.GETTING_RESULTS:
      return (
        <Bulma.Notification color="info" className="mt-5">
          <p className="has-text-centered">Loading</p>
          <progress
            className="progress is-small"
            max="100"
            style={{ animationDuration: '3s', marginBottom: 12 }}
          >
            80%
          </progress>
        </Bulma.Notification>
      );
    case TOP_ANAT_FLOW.LAUNCHING_JOB:
      return (
        <Bulma.Notification color="warning" className="mt-5">
          <progress
            ref={refLaunching}
            className="progress is-small"
            max="100"
            style={{ animationDuration: '3s', marginBottom: 12 }}
          >
            80%
          </progress>

          <p>
            Processing job, waiting for a job id. Please stand by until the job
            is started, or until results are retrieved, if they already exist on
            our server (in that case, we won&apos;t send you a notification
            email, if you provided your address)
          </p>
        </Bulma.Notification>
      );
    case TOP_ANAT_FLOW.GOT_JOB:
      return (
        <Bulma.Notification color="warning" className="mt-5">
          <progress
            ref={refGotJob}
            className="progress is-small"
            max="100"
            style={{ animationDuration: '3s', marginBottom: 12 }}
          >
            80%
          </progress>

          <p>
            After bookmarking this page, it is safe to close this window. Your
            analysis is being run on our server, and the results will appear as
            soon as available. Please note that the results can be slow to
            compute, typically from 5 to 30 minutes, depending on the amount of
            data to process. It is not necessary to refresh this page, it will
            be automatically updated.
          </p>
          <p className="mt-2">Job is running - Job ID: {results.jobId}</p>
        </Bulma.Notification>
      );
    case TOP_ANAT_FLOW.GOT_RESULTS:
      const nbRecords = results.analysis.reduce(
        (acc, analysis) => acc + analysis.results.length,
        0
      );
      const nbAnalysis = results.analysis.length;
      const nbAnalysisSuccess = results.analysis.reduce(
        (acc, analysis) => acc + (analysis.results.length > 0 ? 1 : 0),
        0
      );
      return (
        <Bulma.Notification color="info" className="my-5">
          <p ref={refGotResult}>
            {`TopAnat request successful. Found ${nbRecords} ${isPlural(
              'record',
              nbRecords
            )}, from ${nbAnalysisSuccess} ${isPlural(
              'analyse',
              nbAnalysisSuccess
            )} with results, over ${nbAnalysis} ${isPlural(
              'analyse',
              nbAnalysis
            )} launched.`}
          </p>
        </Bulma.Notification>
      );
    default:
      return null;
  }
};

export default TopAnatBanner;
