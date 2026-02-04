import axiosInstance from './constant';
import errorHandler from '../errorHandler';

const message = {
  submit: ({
    name,
    email,
    subject,
    message,
    info,
    privacy,
  }: {
    name?: string;
    email: string;
    subject: string;
    message: string;
    info: string;
    privacy: boolean;
  }) =>
    new Promise((resolve, reject) => {
      const data: any = {
        name,
        email,
        subject,
        message,
        info,
        privacy,
      };

      axiosInstance
        .post('/?page=message', data)
        .then(({ data: responseData }) => resolve(responseData))
        .catch((error) => {
          errorHandler(error);
          reject(error?.response);
        });
    }),
};

export default message;
