const UserService = {
  GetAllUsers: function() {
    let options = {
      method: 'GET',
      headers: AdminService.GetHeaders()
    }
    return fetch(`${AdminService.apiBaseUri}/user`, options)
      .then(catchFetchError)
      .then(rslt => rslt.json());
  },
  GetUser: function(email) {
    let options = {
      method: 'GET',
      headers: AdminService.GetHeaders()
    }
    return fetch(`${AdminService.apiBaseUri}/user/${email}`, options)
      .then(catchFetchError)
      .then(rslt => rslt.json())
  },
  AddUser: function(email, name, password) {
    let options = { 
      method: 'PUT', 
      body: JSON.stringify({email, name, password}),
      headers: AdminService.GetHeaders()
    }
    return fetch(`${AdminService.apiBaseUri}/user`, options)
      .then(catchFetchError)
      .then(rslt => rslt.json())
  },
  DeleteUser: function(email) {
    let options = { 
      method: 'DELETE',
      headers: AdminService.GetHeaders()
    }
    return fetch(`${AdminService.apiBaseUri}/user/${email}`, options)
      .then(catchFetchError)
      .then(_ => (null))
  },
}