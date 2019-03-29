import Crypto from 'crypto-js';
import Config from '../config.js';

function authenticateUser(token) {
  localStorage.setItem('token', token);
}

function isUserAuthenticated() {
  return localStorage.getItem('token') !== null;
}

function deauthenticateUser() {
  localStorage.removeItem('token');
}

function getToken() {
  return localStorage.getItem('token');
}

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
        'Authorization': `Bearer ${getToken()}`
      })
    });
    let response = await fetch(request);
    let result = response.json();
    return result;
  } catch (error) {
    throw error;
  } 
}

async function postPublic(endpoint, form) {
  try {  
    let request = new Request(`${Config.apiBaseUrl}/${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(form),
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      })
    });
    let response = await fetch(request);
    let result = response.json();
    return result;
  } catch (error) {
    console.log('Api.postPublic', error);
  } 
}

async function signup(form) {
  try {  
    let request = new Request(`${Config.apiBaseUrl}/signup`, {
      method: 'POST',
      body: JSON.stringify(form),
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      })
    });
    let response = await fetch(request);
    let result = response.json();
    return result;
  } catch (error) {
    console.log('Api.signup', error);
  } 
}

async function loginCurrentUser() {
  try {  
    let request = new Request(`${Config.apiBaseUrl}/dashboard`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${getToken()}`
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
  deauthenticateUser();
}

async function getCurrentUserLabs(currentUser) {
  try {
    const getLabsRes = await Api.get('labs');
    const labs = getLabsRes.data;
    let currentUserLabs = [];
    let currentUserLabRequests = [];
    let currentUserLabsToJoin = [];
    for(let i = 0; i < labs.length; i++) {
      let lab = labs[i];
      let labIsJoined = false;
      let labIsRequested = false;
      for(let j = 0; j < lab.users.length; j++) {
        let labUser = lab.users[j];
        //console.log(labUser._id, currentUser._id);
        if (labUser._id === currentUser._id){
          //console.log('matched');
          labIsJoined = true;
          currentUserLabs.push(lab);
        } 
      }
      for(let j = 0; j < lab.joinRequests.length; j++) {
        let joinRequest = lab.joinRequests[j];
        if (joinRequest._id === currentUser._id){
          labIsRequested = true;
          currentUserLabRequests.push(lab);
        }
      }
      if (!labIsJoined && !labIsRequested) {
        currentUserLabsToJoin.push(lab);
      }
    }
    //console.log('userlabs result', currentUserLabs);
    return {
      currentUserLabs,
      currentUserLabRequests,
      currentUserLabsToJoin
    };
  } catch (error) {
    throw error;
  }        
}

async function getCurrentUser() {
  try {
    if (isUserAuthenticated()) {
      const loginCurrentUserRes = await loginCurrentUser();
      if (loginCurrentUserRes.user) {
        let currentUser = loginCurrentUserRes.user;
        currentUser['gravatarUrl'] = `https://www.gravatar.com/avatar/${Crypto.MD5(currentUser.email).toString()}?s=100`;
        let userLabData = await getCurrentUserLabs(currentUser);
        //console.log(currentUserLabs)
        return {
          isLoggedIn: true,
          currentUser,
          currentUserLabs: userLabData.currentUserLabs,
          currentUserLabRequests: userLabData.currentUserLabRequests,
          currentUserLabsToJoin: userLabData.currentUserLabsToJoin
        };
      } else {
        logoutCurrentUser();
        return {
          isLoggedIn: false,
          currentUser: {},
          currentUserLabs: [],
          currentUserLabRequests: [],
          currentUserLabsToJoin: []
        };
      }
    }
  } catch (error) {
    throw error;
  }
}

let Api = { get, post, loginCurrentUser, logoutCurrentUser, getCurrentUserLabs, getCurrentUser, postPublic, signup, authenticateUser, deauthenticateUser, isUserAuthenticated, getToken };

export default Api;