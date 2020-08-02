handlebars.registerHelper('truncate', function(item, length) {
  if (!item || !item.length) { return ''; }
  let safeLength = parseInt(length, 10);
  if (safeLength == NaN || item.length <= safeLength) { return item; }
  return item.substring(0, safeLength);
});