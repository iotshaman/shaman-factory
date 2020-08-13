handlebars.registerHelper('equals', function(value, expected, options) {
  if (value == expected) return options.fn(this);
  else return options.inverse(this);
});