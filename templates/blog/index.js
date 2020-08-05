let WebsiteFactory = require('shaman-website-compiler').WebsiteFactory;
let AppService = require('./dist.api/index.js').AppService;

// Configuring compiler
let config = require('./website.json');
let website = WebsiteFactory(config);

// Building sample website
website.build().then(_routes => {
  AppService(website);
}).catch(ex => {
  console.log(`Compiler error: ${ex}`);
});

