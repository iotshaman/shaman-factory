handlebars.registerHelper('date', function(date, format) {
  if (!format) format = 'MMMM Do YYYY';
  return moment(date).format(format);  
});