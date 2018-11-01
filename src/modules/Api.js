import axios from "axios";
import appConfig from '../configuration.js';

const Api = {
  getAll: async (modelNamePlural) => {
    try {
      let {message, data} = await axios.get(`${appConfig.apiBaseUrl}/${modelNamePlural}`);
      let res = {
        'success': true,
        'message': message,
        'result': data.data,
        'error': null
      };
      return res;
    } catch (error) {
      let res = {
        'success': false,
        'message': `There was a problem fetching ${appConfig.apiBaseUrl}/${modelNamePlural}.`,
        'result': [],
        'error': {
          'code': error.response.status,
          'message': error.response.statusText
        }
      };
      return res;
    }
  }
}

export default Api;