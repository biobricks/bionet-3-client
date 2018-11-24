import appConfig from '../configuration.js';

export const fetchAll = async (query) => {
  try {  
    let req = new Request(`${appConfig.apiBaseUrl}/${query}`, {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
    });
    let res = await fetch(req);
    let response = res.json();
    return response;
  } catch (error) {
    console.log('fetchLabs', error);
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