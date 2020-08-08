const AdminService = {
  apiBaseUri: 'http://localhost:3001/api',
  GetHeaders: function() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  }
}