handlebars.registerHelper('inputSize', function(size) {
  let result = 'col-md-6';
  if (size == 'sm') result = 'col-md-3';
  else if (size == 'xl') result = 'col-12';
  return result;
});