import axios from 'axios';
import { getAxiosAddNotif } from './prod/constant';
import random from '../helpers/random';

const errorHandler = (error) => {
  if (axios.isCancel(error)) {
    console.error(error.message);
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
