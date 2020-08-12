(function() {
  if (!localStorage.getItem('accessToken')) location.href = '/login.html';
})();

function getQueryParams() {
  if (!window.location.search) return {};
  return decodeURI(window.location.search)
    .replace('?', '')
    .split('&')
    .map(param => param.split('='))
    .reduce((values, [ key, value ]) => {
      values[ key ] = value;
      return values;
    }, {});
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}