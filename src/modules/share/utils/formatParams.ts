/**
 * Given a list of {param_key, param_value}, return query string in url of the list
 * @param {*} params
 */

const formatSearchParams = (params: object) => {
  let paramsString = '';
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      paramsString += `${paramsString.length > 0 ? '&' : '?'}${key}=${value}`;
    }
  });
  return paramsString || '?';
};

export default formatSearchParams;
