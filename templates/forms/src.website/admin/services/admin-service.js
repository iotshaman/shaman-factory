const AdminService = {
  GetHeaders: function() {
    let header = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    let token = localStorage.getItem('accessToken');
    if (token) header['Authorization'] = `Bearer ${token}`;
    return header;
  }
}