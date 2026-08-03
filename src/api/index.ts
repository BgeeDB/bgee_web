import topAnat from './prod/topAnat';
import search from './prod/search';
import expressionComparison from './prod/expressionComparison';
import get from './prod/get';
import feedback from './prod/feedback';
import message from './prod/message';

/*
 * ERROR RESPONSE FORMAT
 * {
 *    response: {
 *        data: {
 *            code,
 *            message,
 *            data: { exceptionType, invalidKey },
 *        },
 *    },
 * }
 */

const api = {
  search,
  topAnat,
  expressionComparison,
  get,
  feedback,
  message,
};

export default api;
