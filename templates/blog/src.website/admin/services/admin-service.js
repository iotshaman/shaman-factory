const AdminService = {
  apiBaseUri: 'http://192.168.0.33:3001/api',
  GetHeaders: function() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  }
}