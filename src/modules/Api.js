import Crypto from 'crypto-js';
import Auth from "./Auth";
import Config from '../configuration.js';

async function get(endpoint) {
  try {  
    let request = new Request(`${Config.apiBaseUrl}/${endpoint}`, { method: 'GET' });
    let response = await fetch(request);
    let result = response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

async function post(endpoint, form) {
  try {  
    let request = new Request(`${Config.apiBaseUrl}/${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(form),
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Auth.getToken()}`
      })
    });
    let response = await fetch(request);
    let result = response.json();
    return result;
  } catch (error) {
    throw error;
  } 
}

async function loginCurrentUser() {
  try {  
    let request = new Request(`${Config.apiBaseUrl}/dashboard`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${Auth.getToken()}`
      })
    });
    let response = await fetch(request);
    let result = response.json();
    return result;
  } catch (error) {
    throw error;
  } 
}

function logoutCurrentUser() {
  Auth.deauthenticateUser();
}

async function getCurrentUserLabs(currentUser) {
  try {
    const getLabsRes = await Api.get('labs');
    const labs = getLabsRes.data;
    const getVirtualsRes = await Api.get('virtuals');
    const virtuals = getVirtualsRes.data;
    const getPhysicalsRes = await Api.get('physicals');
    const physicals = getPhysicalsRes.data;        
    currentUser['labs'] = [];
    currentUser['labsRequested'] = [];
    currentUser['labsToJoin'] = [];
    for(let i = 0; i < labs.length; i++) {
      let lab = labs[i];
      let labIsJoined = false;
      let labIsRequested = false;
      for(let j = 0; j < lab.users.length; j++) {
        let labUser = lab.users[j];
        if (labUser._id === currentUser._id){
          labIsJoined = true;
          currentUser.labs.push(lab);
        } 
      }
      for(let j = 0; j < lab.joinRequests.length; j++) {
        let joinRequest = lab.joinRequests[j];
        if (joinRequest._id === currentUser._id){
          labIsRequested = true;
          currentUser.labsRequested.push(lab);
        }
      }
      if (!labIsJoined && !labIsRequested) {
        currentUser.labsToJoin.push(lab);
      }
    }
    return {
      isLoggedIn: true,
      currentUser,
      labs,
      virtuals,
      physicals
    }
  } catch (error) {
    throw error;
  }        
}

async function setCurrentUser() {
  try {
    if (Auth.isUserAuthenticated()) {
      const loginCurrentUserRes = await Api.loginCurrentUser();
      if (loginCurrentUserRes.user) {
        let currentUser = loginCurrentUserRes.user;
        currentUser['gravatarUrl'] = `https://www.gravatar.com/avatar/${Crypto.MD5(currentUser.email).toString()}?s=100`;
        this.getCurrentUserLabs(currentUser);
        return {};
      } else {
        this.logoutCurrentUser();
        return {};
      }
    } else {
      const getVirtualsRes = await Api.get('virtuals');
      const virtuals = getVirtualsRes.data || [];
      const getPhysicalsRes = await Api.get('physicals');
      const physicals = getPhysicalsRes.data || [];
      return {
        virtuals,
        physicals
      }
    }
  } catch (error) {
    throw error;
  }
}

let Api = { get, post, loginCurrentUser, logoutCurrentUser, getCurrentUserLabs, setCurrentUser };

export default Api;