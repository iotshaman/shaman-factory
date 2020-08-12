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
  GetForm: function(uuid) {
    let options = {
      method: 'GET',
      headers: AdminService.GetHeaders()
    }
    return fetch(`${apiBaseUri}/form/${uuid}`, options)
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
  DeleteForm: function(uuid) {
    let options = { 
      method: 'DELETE',
      headers: AdminService.GetHeaders()
    }
    return fetch(`${apiBaseUri}/form/${uuid}`, options)
      .then(catchFetchError)
      .then(_ => (null))
  },
  GetAllFormSubmissions: function() {
    let options = {
      method: 'GET',
      headers: AdminService.GetHeaders()
    }
    return fetch(`${apiBaseUri}/form/submissions`, options)
      .then(catchFetchError)
      .then(rslt => rslt.json());
  },
  GetFormSubmission: function(uuid) {
    let options = {
      method: 'GET',
      headers: AdminService.GetHeaders()
    }
    return fetch(`${apiBaseUri}/form/submissions/${uuid}`, options)
      .then(catchFetchError)
      .then(rslt => rslt.json());
  },
  SubmitForm: function(form) {
    let options = { 
      method: 'POST', 
      body: JSON.stringify(form),
      headers: AdminService.GetHeaders()
    }
    return fetch(`${apiBaseUri}/form/submit`, options)
      .then(catchFetchError)
      .then(rslt => rslt.json())
  }
}