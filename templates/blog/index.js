let WebsiteFactory = require('shaman-website-compiler').WebsiteFactory;

// Configuring compiler
let config = require('./website.json');
let website = WebsiteFactory(config);

// Building sample website
website.build().then(_routes => {
  require('./dist.api/index.js');
}).catch(ex => {
  console.log(`Compiler error: ${ex}`);
});

