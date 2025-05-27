import topAnat from './prod/topAnat';
import search from './prod/search';
import expressionComparison from './prod/expressionComparison';
import get from './prod/get';
import feedback from './prod/feedback';

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
};

export default api;
