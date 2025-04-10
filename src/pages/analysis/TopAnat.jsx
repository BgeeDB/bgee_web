/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions,jsx-a11y/label-has-associated-control */
import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';
import PATHS from '../../paths/paths';
import api from '../../api';
import TopAnatBanner from '../../components/TopAnat/TopAnatBanner';
import useTopAnat, { TOP_ANAT_FLOW } from '../../hooks/useTopAnat';
import TopAnatForm from '../../components/TopAnat/TopAnatForm';
import { NotificationContext } from '../../contexts/NotificationsContext';
import { addTopAnatHistory } from '../../components/TopAnat/TopAnatHistoryModal';
import TopAnatResult from '../../components/TopAnat/TopAnatResult';
import TopAnatHead from '../../components/TopAnat/TopAnatHead';
import TopAnatActionButtons from '../../components/TopAnat/TopAnatActionButtons';
import { getAxiosAddNotif } from '../../api/prod/constant';
import random from '../../helpers/random';
import ApiReducer from '../../helpers/ApiReducer';
import { TOP_ANAT_DEFAULT_RP } from '../../helpers/constants/topAnat';
import config from '../../config.json';

const { ID_FULL_LENGTH } = config.dataTypeIds;

let getJobStatusTimeOut;

const TopAnat = () => {
  const navigate = useNavigate();
  const loc = useLocation();
  const { id, jobId } = useParams();
  const { state: pageState } = useLocation();
  const { addNotification } = React.useContext(NotificationContext);
  const [flowState, setFlowState] = React.useState(TOP_ANAT_FLOW.LOADING);

  const {
    form: {
      data,
      setData,
      handleChange,
      errors,
      foregroundHandler,
      backgroundHandler,
      checkBoxHandler,
      onSelectCustomStage,
      resetForm,
      resetError,
    },
    job,
    requestParameters,
    results,
    setResults,
  } = useTopAnat(flowState, setFlowState);

  const oldResultFragment = '#/result/';
  if (loc.hash !== '' && loc.hash.match(oldResultFragment) ) {
    // Get result hashtag from loc.hash, and clean the loc.hash value
    const resultId = loc.hash.replace(oldResultFragment, '');
    loc.hash = '';
    // Rewrite the loc with the current pathname + resultId
    navigate(`${resultId}`);
  }

  const getJobStatus = React.useCallback((ID, jobID, requestParams = true) => {
    api.topAnat
      .getJob(ID, jobID, requestParams)
      .then((res) => {
        if (res.data.jobResponse.jobStatus === 'UNDEFINED') {
          if (res.data?.jobResponse?.data)
            navigate(
              PATHS.ANALYSIS.TOP_ANAT_RESULT.replace(
                ':id',
                res.data.jobResponse.data
              )
            );
          else {
            resetForm();
            setFlowState(TOP_ANAT_FLOW.ERROR_GET_JOB);

            getAxiosAddNotif()({
              id: random().toString(),
              children: (
                <p>
                  The job is undefined. Please contact the administrator and
                  give the current url.
                </p>
              ),
              className: `is-danger`,
            });
          }
        } else if (res.data.jobResponse.jobStatus === 'RUNNING') {
          getJobStatusTimeOut = setTimeout(
            () => getJobStatus(ID, jobID, false),
            7000
          );
          setResults({ jobId: res.data.jobResponse.jobId });
          if (requestParams) {
            setData((prev) => ({
              ...prev,
              genes: (res.requestParameters.fg_list || []).join('\n'),
              genesBg: (res.requestParameters?.bg_list || []).join('\n'),
              email: '',
              jobDescription: res.requestParameters.job_title || '',
              stages: res.requestParameters.stage_id || 'all',
              dataQuality: res.requestParameters.data_qual,
              decorrelationType: res.requestParameters.decorr_type,
              nodeSize: res.requestParameters.node_size || '',
              nbNode: res.requestParameters.nb_node || '',
              fdrThreshold: res.requestParameters.fdr_thr || '',
              pValueThreshold: res.requestParameters.p_value_thr || '',
              rnaSeq: Boolean(
                res?.requestParameters?.data_type?.find((f) => f === 'RNA_SEQ')
              ),
              affymetrix: Boolean(
                res?.requestParameters?.data_type?.find(
                  (f) => f === 'AFFYMETRIX'
                )
              ),
              inSitu: Boolean(
                res?.requestParameters?.data_type?.find((f) => f === 'IN_SITU')
              ),
              full: Boolean(
                res?.requestParameters?.data_type?.find(
                  (f) => f === ID_FULL_LENGTH
                )
              ),
              est: Boolean(
                res?.requestParameters?.data_type?.find((f) => f === 'EST')
              ),
            }));
            requestParameters.set({
              TOP_ANAT_DEFAULT_RP,
              customBg: Boolean(res.requestParameters.bg_list),
            });

            api.topAnat
              .autoCompleteGenes(res.requestParameters.fg_list.join('\n'))
              .then((r) => {
                requestParameters.set((prev) => ({
                  ...(prev || {}),
                  fg: {
                    list: r.data.fg_list,
                    message: r.message,
                  },
                }));
              })
              .catch((err) => {
                console.debug('[ERROR] api.topAnat.autoComplete', err);
              });
            if (res.requestParameters.bg_list)
              api.topAnat
                .autoCompleteGenes(
                  res.requestParameters.bg_list.join('\n'),
                  false
                )
                .then((r) => {
                  requestParameters.set((prev) => ({
                    ...(prev || {}),
                    bg: {
                      list: r.data.bg_list,
                      message: r.message,
                    },
                  }));
                })
                .catch((err) => {
                  console.debug('[ERROR] api.topAnat.autoComplete', err);
                });
          }
          setFlowState(TOP_ANAT_FLOW.GOT_JOB);
        } else {
          navigate(
            PATHS.ANALYSIS.TOP_ANAT_RESULT.replace(
              ':id',
              res.data.jobResponse.data
            )
          );
        }
      })
      .catch((err) => {
        console.debug('[ERROR] api.topAnat.getResults(%s)', ID, err);
        setFlowState(TOP_ANAT_FLOW.ERROR_GET_JOB);
      });
  }, []);
  const getResults = React.useCallback((ID) => {
    api.topAnat
      .getResults(ID)
      .then((res) => {
        const rp = res.requestParameters;
        addTopAnatHistory(
          ID,
          res.data.fg_list.selectedSpecies,
          res.data.fg_list.detectedSpecies[res.data.fg_list.selectedSpecies]
            .name,
          res.requestParameters.job_title
        );

        setData(ApiReducer.topAnatForm(rp));
        requestParameters.set(ApiReducer.topAnatRequestParameters(res, rp));
        setResults({
          analysis: res.data.topAnatResults,
          data: res.data.topAnatResults.reduce(
            (acc, a) => [...acc, ...a.results],
            []
          ),
        });
        setFlowState(TOP_ANAT_FLOW.GOT_RESULTS);
      })
      .catch((err) => {
        if (
          err?.data?.data.exceptionType === 'JobResultNotFoundException' &&
          err.data.code === 400
        ) {
          const rp = err.data.requestParameters;
          const formData = ApiReducer.topAnatForm(rp)({});
          setData(ApiReducer.topAnatForm(rp));
          requestParameters.set(
            ApiReducer.topAnatRequestParameters(err.data, rp)
          );

          setFlowState(TOP_ANAT_FLOW.LAUNCHING_JOB);
          api.topAnat
            .runJob(formData)
            .then((res) => {
              navigate(
                PATHS.ANALYSIS[
                  res.data.jobResponse.jobStatus === 'RUNNING'
                    ? 'TOP_ANAT_RESULT_JOB_ID'
                    : 'TOP_ANAT_RESULT'
                ]
                  .replace(':id', res.data.jobResponse.data)
                  .replace(':jobId', res.data.jobResponse.jobId)
              );
            })
            .catch((error) => {
              console.debug('[ERROR] api.topAnat.runJob', data, error);
              setFlowState(TOP_ANAT_FLOW.ERROR_LAUNCH_JOB);
            });
          return;
        }
        setFlowState(TOP_ANAT_FLOW.ERROR_GET_RESULTS);
      });
  }, []);

  React.useEffect(() => {
    if (flowState === TOP_ANAT_FLOW.NEW_JOB && requestParameters.bg) {
      addNotification({
        id: random().toString(),
        children: (
          <p>
            {requestParameters.fg.list.selectedSpecies ===
            requestParameters.bg.list.selectedSpecies
              ? 'Foreground/background species are identical.'
              : 'Foreground and background species differ. You can either change your background or the default one will be used.'}
          </p>
        ),
        className: `is-${
          requestParameters.fg.list.selectedSpecies ===
          requestParameters.bg.list.selectedSpecies
            ? 'success'
            : 'danger'
        }`,
      });
    }
  }, [requestParameters, flowState]);
  /*
   * Effect @ url change
   */
  React.useEffect(() => {
    if (getJobStatusTimeOut) clearTimeout(getJobStatusTimeOut);

    if (!id && !jobId && pageState?.form && pageState?.requestParameters) {
      setData(pageState.form);
      requestParameters.set(pageState.requestParameters);
    }
    if (!id && !jobId && !pageState?.form && !pageState?.requestParameters)
      resetForm();

    resetError();
    if (id) {
      resetForm();
    }
    if (id && !jobId) {
      setFlowState(TOP_ANAT_FLOW.GETTING_RESULTS);
      getResults(id);
    } else if (id && jobId) {
      resetError();
      setFlowState(TOP_ANAT_FLOW.GETTING_JOB);
      getJobStatus(id, jobId);
    } else {
      setFlowState(TOP_ANAT_FLOW.NEW_JOB);
    }
  }, [id, jobId, pageState]);

  return (
    <>
      <TopAnatHead />
      <TopAnatForm
        status={flowState}
        form={{ handleChange, data, errors }}
        requestParameters={requestParameters.value}
        handlers={{
          foregroundHandler,
          backgroundHandler,
          setRP: requestParameters.set,
          onSelectCustomStage,
          checkBoxHandler,
        }}
      />
      <TopAnatActionButtons
        status={flowState}
        handleSubmit={job.submit}
        data={data}
        jobId={jobId}
        cancelJob={job.cancel(jobId)}
        startNewJob={job.startNew}
        isDisabled={data.genes === ''}
      />
      <TopAnatBanner results={results} status={flowState} />
      <TopAnatResult
        status={flowState}
        results={results}
        searchId={id}
        title={data?.jobDescription}
        fg={requestParameters.value.fg}
        jobId={jobId}
        data={data}
      />
    </>
  );
};

export default TopAnat;
