import axiosInstance from './constant';
import errorHandler from '../errorHandler';

const feedback = {
  submit: ({
    sourceUrl,
    rating,
    comment,
    email,
  }: {
    sourceUrl: string;
    rating: number;
    comment: string;
    email?: string;
  }) =>
    new Promise((resolve, reject) => {
      const data: any = {
        source_url: sourceUrl,
        rating,
        comment,
      };
      if (email) data.email = email;

      axiosInstance
        .post('/?page=feedback', data)
        .then(({ data: responseData }) => resolve(responseData))
        .catch((error) => {
          errorHandler(error);
          reject(error?.response);
        });
    }),
};

export default feedback;
