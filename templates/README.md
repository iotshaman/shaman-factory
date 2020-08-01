## Shaman Factory Templates - IoT Shaman

![Build Status](https://travis-ci.org/iotshaman/shaman-factory.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/iotshaman/shaman-factory/badge.svg?branch=master)](https://coveralls.io/github/iotshaman/shaman-factory?branch=master)

## Templates

Shaman Factory comes pre-installed with templates to choose from. Every template is [shaman-website-compiler](https://github.com/iotshaman/shaman-website-compiler) compatible, meaning every website created by Shaman Factory will follow the best-practices of file minification, file bundling, pre-rendering, and so much more. This is a solid start gaining a competitive advantage in the online marketplace! This list is subject to change, so check back in periodically to see what's new.

### Default Template

```sh
factory create [name]
```

The default template is a really simple, bare-bones template that showcases some of the cool features of [shaman-website-compiler](https://github.com/iotshaman/shaman-website-compiler). Below is a list of some of the things to explore:

- Uses a small [json-repository](https://github.com/iotshaman/json-repository) database file (*data/db.json*) to store blog data. This data is used to populate the index.html page with a list of blogs, and is used as a [dynamic file](https://github.com/iotshaman/shaman-website-compiler#dynamic-file-configuration) to create, at time of compilation, a new HTML file for each blog.
- Contains 2 [helper files](https://github.com/iotshaman/shaman-website-compiler#handlebars-helpers) which allows developers to add custom code to their templates.
- Includes 2 [partial files](https://github.com/iotshaman/shaman-website-compiler#handlebars-partials) that can be reused in any template page.
- The index.html page includes 2 [files bundles](https://github.com/iotshaman/shaman-website-compiler#bundles), which are combined into 1 file by the compiler, making your website faster and improves SEO score. The exported style bundle is also used in the blog.html file.
- The default template is configured to be in development mode by default. If you use this template to build a production website, make sure to change the "production" value to "true" in your *website.json* configuration file. 