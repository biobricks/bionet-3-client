import Auth from "./Auth";
import Config from '../configuration.js';

async function get(endpoint) {
  try {  
    let request = new Request(`${Config.apiBaseUrl}/${endpoint}`, { method: 'GET' });
    let response = await fetch(request);
    let result = response.json();
    //console.log('Api.get.result', result);
    return result;
  } catch (error) {
    console.log('Api.get', error);
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
    console.log('Api.post', error);
  } 
}

let Api = { get, post };

export default Api;