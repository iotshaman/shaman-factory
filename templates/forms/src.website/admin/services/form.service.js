const FormService = {
  GetAllForms: function() {
    let options = {
      method: 'GET',
      headers: AdminService.GetHeaders()
    }
    return fetch(`${apiBaseUri}/form`, options)
      .then(catchFetchError)
      .then(rslt => rslt.json());
  },
  GetForm: function(name) {
    let options = {
      method: 'GET',
      headers: AdminService.GetHeaders()
    }
    return fetch(`${apiBaseUri}/form/${name}`, options)
      .then(catchFetchError)
      .then(rslt => rslt.json())
  },
  AddForm: function(name, description) {
    let options = { 
      method: 'PUT', 
      body: JSON.stringify({name, description, uuid: uuidv4()}),
      headers: AdminService.GetHeaders()
    }
    return fetch(`${apiBaseUri}/form`, options)
      .then(catchFetchError)
      .then(rslt => rslt.json())
  },
  UpdateForm: function(form) {
    let options = { 
      method: 'POST', 
      body: JSON.stringify(form),
      headers: AdminService.GetHeaders()
    }
    return fetch(`${apiBaseUri}/form`, options)
      .then(catchFetchError)
      .then(rslt => rslt.json())
  },
  DeleteForm: function(name) {
    let options = { 
      method: 'DELETE',
      headers: AdminService.GetHeaders()
    }
    return fetch(`${apiBaseUri}/form/${name}`, options)
      .then(catchFetchError)
      .then(_ => (null))
  },
}