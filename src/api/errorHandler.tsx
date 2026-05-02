import axios from 'axios';
import { getAxiosAddNotif } from './prod/constant';
import random from '../helpers/random';

const errorHandler = (error) => {
  // Intentional cancellation (new search superseded the old one): do not log or notify.
  if (axios.isCancel(error)) {
    return;
  }
  if (error?.response) {
    getAxiosAddNotif()({
      id: random().toString(),
      children: <p>{error?.response?.data?.message || error?.message}</p>,
      className: `is-danger`,
    });
  } else if (error?.request) {
    // The request was made but no response was received
    console.debug('Error api request', error.request);
  } else {
    console.debug('Error api', error.message);
  }
};

export default errorHandler;
