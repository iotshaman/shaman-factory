const BlogService = {
  apiBaseUri: 'http://192.168.0.33:3001/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  GetAllBlogs: function() {
    return fetch(`${BlogService.apiBaseUri}/blog`)
      .then(catchFetchError)
      .then(rslt => rslt.json());
  },
  GetBlog: function(filename) {
    return fetch(`${BlogService.apiBaseUri}/blog/${filename}`)
      .then(catchFetchError)
      .then(rslt => rslt.json())
  },
  UpdateBlog: function(blog) {
    let options = { 
      method: 'POST', 
      body: JSON.stringify(blog),
      headers: BlogService.headers
    }
    return fetch(`${BlogService.apiBaseUri}/blog`, options)
      .then(catchFetchError)
      .then(rslt => rslt.json())
  }
}