let WebsiteFactory = require('shaman-website-compiler').WebsiteFactory;

// Configuring compiler
let config = require('./website.json');
let website = WebsiteFactory(config);

// Building sample website
website.build().then(routes => {
  // do something (optional)
}).catch(ex => {
  console.log(`Compiler error: ${ex}`);
})

