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

### Admin Template

```sh
factory create [name] admin
```

The admin template is a full-featured website, with no content, that contains all the necessary scaffolding to develop an admin panel. There are two user interface components to this system (public / private), as well as one back-end API component. The admin template is created from the default template, with additional features added.

#### User Interface
- The public facing component of the user interface contains a splash-page that has no content.
- There is a private facing component to the user interface, which requires users to login. The default email address is 'contact@iotshaman.com' and the default password is 'test'. You can change the default user in the json-repo database file, but will need to use the admin panel interface to change passwords.

#### API Server
- The API server is built using Typescript and is responsible for handling requests to manage blog / user content. 
- All requests to the API require an access token, which is generated when a user logs in. The access token will expire after 2 days and will require the user to re-login. 

### Blog Template

```sh
factory create [name] blog
```

The blog template is a full-featured website to fascilitate one thing, and one thing only, and that is creating and publishing blog content. There are two user interface components to this system (public / private), as well as one back-end API component. The blog template is created from the admin template, with additional features added.

#### User Interface
- The public facing component of the user interface contains a splash-page with blog data listed in cards. For each blog there is also a full HTML page, which can be accessed by clicking the blog card.
- There is also a private facing component to the user interface, which requires users to login. The default email address is 'contact@iotshaman.com' and the default password is 'test'. You can change the default user in the json-repo database file, but will need to use the admin panel interface to change passwords.
- Once you have logged into the private interface section, you can use the site navigation menu (click button in top-right) to navigate to either the blog management page, or the user management page.
- When blog content is updated in the private section, the website will be re-compiled.

#### API Server
- The API server is built using Typescript and is responsible for handling requests to manage blog / user content. 
- All requests to the API require an access token, which is generated when a user logs in. The access token will expire after 2 days and will require the user to re-login. 