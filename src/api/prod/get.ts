import axiosInstance from './constant';

const DEFAULT_PARAMETERS = (page: string, action: string = '') => {
  const params = new URLSearchParams();

  params.append('display_type', 'json');
  params.append('page', page);
  if (action) params.append('action', action);

  return params;
};
const get = {
  dataSources: (): any =>
    new Promise((resolve, reject) => {
      const params = DEFAULT_PARAMETERS('source');

      axiosInstance
        .get(`/?${params.toString()}`)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.data));
    }),
};

export default get;
