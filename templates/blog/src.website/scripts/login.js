const apiBaseUri = 'http://192.168.0.33:3001/api';
const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

function SubmitLogin(email, password) {
  let options = { 
    method: 'POST', 
    body: JSON.stringify({email, password}),
    headers: headers
  }
  fetch(`${apiBaseUri}/login`, options)
    .then(catchFetchError)
    .then(rslt => rslt.json())
    .then(rslt => {
      localStorage.setItem('accessToken', rslt.accessToken);
      location.href = '/admin/blog-panel.html';
    })
    .catch(console.dir)
}