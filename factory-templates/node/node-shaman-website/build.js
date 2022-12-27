let WebsiteFactory = require('shaman-website-compiler').WebsiteFactory;

// Configuring compiler
let config = require('./website.json');
let website = WebsiteFactory(config);

// Building sample website
website.build().then(routes => {
  console.log("Build complete.");
  process.exit(0);
}).catch(ex => {
  console.log(`Compiler error: ${ex}`);
  process.exit(1);
})

