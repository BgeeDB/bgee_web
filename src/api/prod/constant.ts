import axios from 'axios';
import config from '../../config.json';

// Vite sets import.meta.env.DEV automatically (true for `npm run dev`, false for production builds).
const apiBaseUrl = import.meta.env.DEV && config.apiDomainDev ? config.apiDomainDev : config.apiDomain;

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
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
