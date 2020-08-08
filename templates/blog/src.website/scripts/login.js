const apiBaseUri = 'http://localhost:3001/api';
const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

if (localStorage.getItem('accessToken')) location.href = '/admin/blog-panel.html';

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
      if (rslt.temporaryPass) location.href = '/change-password.html';
      else location.href = '/admin/blog-panel.html';
    })
    .catch(console.dir)
}

function SubmitPasswordChange(email, oldPassword, newPassword, confirmPassword) {
  if (newPassword != confirmPassword) {
    alert("Passwords do not match.");
    return;
  }
  let options = { 
    method: 'POST', 
    body: JSON.stringify({email, oldPassword, newPassword}),
    headers: headers
  }
  fetch(`${apiBaseUri}/login/${email}/pwd`, options)
    .then(catchFetchError)
    .then(rslt => rslt.json())
    .then(rslt => {
      localStorage.setItem('accessToken', rslt.accessToken);
      location.href = '/admin/blog-panel.html';
    })
    .catch(console.dir)
}