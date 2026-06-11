import axios from 'axios';
import config from '../../config.json';

// SSR goes through internal API domain to avoid Cloudflare limitations
const baseURL = import.meta.env.SSR ? (process.env.INTERNAL_API_DOMAIN ?? config.apiDomain) : config.apiDomain;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

let axiosAddNotif = null;
export const setAxiosAddNotif = (fct) => {
  axiosAddNotif = fct;
};
export const getAxiosAddNotif = () =>
  axiosAddNotif ||
  ((data: any) => () => {
    console.debug('axiosAddNotif', data);
  });

export default axiosInstance;

export const FULL_LENGTH_LABEL = config.dataTypeLabels.FULL_LENGTH;
export const SOURCE_LETTER_FULL_LENGTH = config.dataTypeSourceLetter.SL_FULL_LENGTH;
