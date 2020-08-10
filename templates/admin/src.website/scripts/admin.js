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