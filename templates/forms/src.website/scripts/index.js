const apiBaseUri = 'http://localhost:3001/api';
const defaultHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

function catchFetchError(response) {
  if (!response.ok) {
    if (response.status == 403) {
      localStorage.removeItem('accessToken');
      location.href = '/login.html';
      return;
    }
    alert(response.statusText);
    throw new Error(response.statusText);
  }
  return response;
}