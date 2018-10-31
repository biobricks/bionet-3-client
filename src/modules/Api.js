import axios from "axios";
import appConfig from '../configuration.js';

const Api = {
  getAll: async (modelNamePlural) => {
    try {
      let {message, data} = await axios.get(`${appConfig.apiBaseUrl}/${modelNamePlural}`);
      let res = {
        'success': true,
        'message': message,
        'error': null
      };
      res[`${modelNamePlural}`] = data.data;
      return res;
    } catch (error) {
      let res = {
        'success': false,
        'message': `There was a problem fetching ${appConfig.apiBaseUrl}/${modelNamePlural}.`,
        'error': {
          'code': error.response.status,
          'message': error.response.statusText
        }
      };
      res[`${modelNamePlural}`] = [];
      return res;
    }
  }
}

export default Api;