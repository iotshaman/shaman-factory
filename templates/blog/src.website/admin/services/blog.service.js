const BlogService = {
  GetAllBlogs: function() {
    let options = {
      method: 'GET',
      headers: AdminService.GetHeaders()
    }
    return fetch(`${AdminService.apiBaseUri}/blog`, options)
      .then(catchFetchError)
      .then(rslt => rslt.json());
  },
  GetBlog: function(filename) {
    let options = {
      method: 'GET',
      headers: AdminService.GetHeaders()
    }
    return fetch(`${AdminService.apiBaseUri}/blog/${filename}`, options)
      .then(catchFetchError)
      .then(rslt => rslt.json())
  },
  AddBlog: function(title) {
    let options = { 
      method: 'PUT', 
      body: JSON.stringify({title}),
      headers: AdminService.GetHeaders()
    }
    return fetch(`${AdminService.apiBaseUri}/blog`, options)
      .then(catchFetchError)
      .then(rslt => rslt.json())
  },
  UpdateBlog: function(blog) {
    let options = { 
      method: 'POST', 
      body: JSON.stringify(blog),
      headers: AdminService.GetHeaders()
    }
    return fetch(`${AdminService.apiBaseUri}/blog`, options)
      .then(catchFetchError)
      .then(rslt => rslt.json())
  },
  DeleteBlog: function(filename) {
    let options = { 
      method: 'DELETE',
      headers: AdminService.GetHeaders()
    }
    return fetch(`${AdminService.apiBaseUri}/blog/${filename}`, options)
      .then(catchFetchError)
      .then(_ => (null))
  },
}