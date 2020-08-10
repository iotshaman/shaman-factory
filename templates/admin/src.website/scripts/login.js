const redirect = '/admin/user-panel.html'
if (localStorage.getItem('accessToken')) location.href = redirect;

function SubmitLogin(email, password) {
  let options = { 
    method: 'POST', 
    body: JSON.stringify({email, password}),
    headers: defaultHeaders
  }
  fetch(`${apiBaseUri}/login`, options)
    .then(catchFetchError)
    .then(rslt => rslt.json())
    .then(rslt => {
      localStorage.setItem('accessToken', rslt.accessToken);
      if (rslt.temporaryPass) location.href = '/change-password.html';
      else location.href = redirect;
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
    headers: defaultHeaders
  }
  fetch(`${apiBaseUri}/login/${email}/pwd`, options)
    .then(catchFetchError)
    .then(rslt => rslt.json())
    .then(rslt => {
      localStorage.setItem('accessToken', rslt.accessToken);
      location.href = redirect;
    })
    .catch(console.dir)
}