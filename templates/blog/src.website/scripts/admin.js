(function() {
  if (!localStorage.getItem('accessToken')) location.href = '/login.html';
})()