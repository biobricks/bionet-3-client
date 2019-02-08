<<<<<<< HEAD
import Auth from "./Auth";
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
  },
  getOne: async (modelNamePlural, id) => {
    try {
      let {message, data} = await axios.get(`${appConfig.apiBaseUrl}/${modelNamePlural}/${id}`);
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
        'message': `There was a problem fetching ${appConfig.apiBaseUrl}/${modelNamePlural}/${id}.`,
        'result': [],
        'error': {
          'code': error.response.status,
          'message': error.response.statusText
        }
      };
      return res;
    }
  },
  updateLab: async (lab) => {
    try {
      let config = {
        'headers': {  
          'authorization': `Bearer ${Auth.getToken()}`
        },
        'json': true
      };
      let {message, data} = await axios.post(`${appConfig.apiBaseUrl}/labs/${lab._id}/membership`, lab, config);
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
        'message': `There was a problem posting to ${appConfig.apiBaseUrl}/labs/${lab._id}/membership .`,
        'result': {},
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
=======
import appConfig from '../configuration.js';

export const fetchAll = async (query) => {
  try {  
    let req = new Request(`${appConfig.apiBaseUrl}/${query}`, {
      method: 'GET',
      // headers: new Headers({
      //   'Authorization': `Bearer ${localStorage.getItem('token')}`
      // })
    });
    let res = await fetch(req);
    let response = res.json();
    return response;
  } catch (error) {
    console.log('fetchAll', error);
    throw error;
  } 
};

export const sortUserLabs = (user, labs) => {
  user['labs'] = [];
  user['labsRequested'] = [];
  user['labsToJoin'] = [];
  for(let i = 0; i < labs.length; i++) {
    let lab = labs[i];
    let labIsJoined = false;
    let labIsRequested = false;
    for(let j = 0; j < lab.users.length; j++) {
      let labUser = lab.users[j];
      if (labUser._id === user._id){
        labIsJoined = true;
        user.labs.push(lab);
      } 
    }
    for(let j = 0; j < lab.joinRequests.length; j++) {
      let joinRequest = lab.joinRequests[j];
      if (joinRequest._id === user._id){
        labIsRequested = true;
        user.labsRequested.push(lab);
      }
    }
    if (!labIsJoined && !labIsRequested) {
      user.labsToJoin.push(lab);
    }
  }
  return user;
}

export const loginCurrentUser = async () => {
  try {  
    let req = new Request(`${appConfig.apiBaseUrl}/dashboard`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
    });
    let res = await fetch(req);
    let response = res.json();
    return response;
  } catch (error) {
    console.log('loginCurrentUser', error);
    throw error;
  } 
}
>>>>>>> 33ec7c4c5ddd8f53b73e7dc83423a0a8c2c8c1de
