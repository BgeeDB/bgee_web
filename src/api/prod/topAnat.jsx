import axios from 'axios';
import axiosInstance, { getAxiosAddNotif } from './constant';
import errorHandler from '../errorHandler';
import random from '../../helpers/random';
import config from '../../config.json';

const { ID_FULL_LENGTH } = config.dataTypeIds;

export const TOP_ANAT_CANCEL_API = {
  autoCompleteGenes: null,
  runJob: null,
  getJob: null,
  cancelJob: null,
  getResults: null,
};

const DEFAULT_PARAMETERS = (page = 'top_anat') => {
  const params = new URLSearchParams();

  params.append('ajax', 1);
  params.append('display_type', 'json');
  params.append('page', page);

  return params;
};

const topAnat = {
  autoCompleteGenes: (genes, isFg = true) =>
    new Promise((resolve, reject) => {
      if (TOP_ANAT_CANCEL_API.autoCompleteGenes) {
        TOP_ANAT_CANCEL_API.autoCompleteGenes();
        TOP_ANAT_CANCEL_API.autoCompleteGenes = null;
      }
      const params = DEFAULT_PARAMETERS();
      params.append('action', 'gene_validation');
      params.append(isFg ? 'fg_list' : 'bg_list', genes);
      axiosInstance
        .post('/', params, {
          cancelToken: new axios.CancelToken((c) => {
            // An executor function receives a cancel function as a parameter
            TOP_ANAT_CANCEL_API.autoCompleteGenes = c;
          }),
        })
        .then(({ data }) => resolve(data))
        .catch((error) => {
          errorHandler(error);
          reject(error?.response);
        });
    }),
  runJob: (form) =>
    new Promise((resolve, reject) => {
      if (TOP_ANAT_CANCEL_API.runJob) {
        TOP_ANAT_CANCEL_API.runJob();
        TOP_ANAT_CANCEL_API.runJob = null;
      }
      const t = new Date();
      const paddedValue = (v) => String(v).padStart(2, '0');

      const params = DEFAULT_PARAMETERS();
      params.append('action', 'submit_job');
      params.append('display_rp', 1);
      params.append('fg_list', form.genes);
      params.append('bg_list', form.genesBg);
      if (form.rnaSeq) params.append('data_type', 'RNA_SEQ');
      if (form.full) params.append('data_type', ID_FULL_LENGTH);
      if (form.affymetrix) params.append('data_type', 'AFFYMETRIX');
      if (form.inSitu) params.append('data_type', 'IN_SITU');
      if (form.est) params.append('data_type', 'EST');
      if (form.stages === 'all') {
        params.append('stage_id', '');
      } else {
        form.stages.forEach((s) => params.append('stage_id', s));
      }
      params.append('data_qual', form.dataQuality);
      params.append('decorr_type', form.decorrelationType);
      params.append('node_size', form.nodeSize);
      params.append('nb_node', form.nbNode);
      params.append('fdr_thr', form.fdrThreshold);
      params.append('p_value_thr', form.pValueThreshold);
      params.append(
        'job_creation_date',
        `${paddedValue(t.getDate())}/${paddedValue(
          t.getMonth()
        )}/${t.getFullYear()}, ${paddedValue(t.getHours())}:${paddedValue(
          t.getMinutes()
        )}:${paddedValue(t.getSeconds())}`
      );
      params.append('job_title', form.jobDescription);
      params.append('email', form.email);
      params.append('submitted', 'true');
      params.append('expr_type', 'EXPRESSED');
      axiosInstance
        .post(`/`, params, {
          cancelToken: new axios.CancelToken((c) => {
            // An executor function receives a cancel function as a parameter
            TOP_ANAT_CANCEL_API.autoCompleteGenes = c;
          }),
        })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          errorHandler(error);
          reject(error?.response);
        });
    }),
  getJob: (searchId, jobId, requestParams) =>
    new Promise((resolve, reject) => {
      if (TOP_ANAT_CANCEL_API.getJob) {
        TOP_ANAT_CANCEL_API.getJob();
        TOP_ANAT_CANCEL_API.getJob = null;
      }
      const params = DEFAULT_PARAMETERS();
      params.append('action', 'tracking_job');
      if (requestParams) params.append('display_rp', 1);
      if (jobId) params.append('job_id', jobId);
      params.append('data', searchId);
      axiosInstance
        .get(`/?${params.toString()}`, {
          cancelToken: new axios.CancelToken((c) => {
            // An executor function receives a cancel function as a parameter
            TOP_ANAT_CANCEL_API.autoCompleteGenes = c;
          }),
        })
        .then(({ data }) => resolve(data))
        .catch((error) => {
          errorHandler(error);
          reject(error);
        });
    }),
  cancelJob: (jobId) =>
    new Promise((resolve, reject) => {
      if (TOP_ANAT_CANCEL_API.cancelJob) {
        TOP_ANAT_CANCEL_API.cancelJob();
        TOP_ANAT_CANCEL_API.cancelJob = null;
      }
      const params = DEFAULT_PARAMETERS('job');
      params.append('job_id', jobId);
      params.append('action', 'cancel');
      axiosInstance
        .post(`/`, params, {
          cancelToken: new axios.CancelToken((c) => {
            // An executor function receives a cancel function as a parameter
            TOP_ANAT_CANCEL_API.cancelJob = c;
          }),
        })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          errorHandler(error);
          reject(error?.response);
        });
    }),
  getResults: (searchId) =>
    new Promise((resolve, reject) => {
      if (TOP_ANAT_CANCEL_API.getResults) {
        TOP_ANAT_CANCEL_API.getResults();
        TOP_ANAT_CANCEL_API.getResults = null;
      }
      const params = DEFAULT_PARAMETERS();
      params.append('action', 'get_results');
      params.append('gene_info', 1);
      params.append('display_rp', 1);
      params.append('data', searchId);
      axiosInstance
        .get(`/?${params.toString()}`, {
          cancelToken: new axios.CancelToken((c) => {
            // An executor function receives a cancel function as a parameter
            TOP_ANAT_CANCEL_API.autoCompleteGenes = c;
          }),
        })
        .then(({ data }) => resolve(data))
        .catch((error) => {
          if (
            error?.response?.data?.code === 400 &&
            error?.response?.data?.data?.exceptionType ===
              'JobResultNotFoundException'
          ) {
            getAxiosAddNotif()({
              id: random().toString(),
              children: (
                <p>
                  Results were not present on our server, resubmitting the
                  analysis
                </p>
              ),
              className: `is-warning`,
            });
          } else {
            errorHandler(error);
          }
          reject(error?.response);
        });
    }),
};

export default topAnat;
