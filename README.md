## Shaman Factory - IoT Shaman

![npm badge](https://img.shields.io/npm/v/shaman-factory.svg) ![Build Status](https://travis-ci.org/iotshaman/shaman-factory.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/iotshaman/shaman-factory/badge.svg?branch=master)](https://coveralls.io/github/iotshaman/shaman-factory?branch=master)

### Build high quality websites with minimal effort. Just start designing!

## Requirements
- Node JS

## Quick Start

Open a terminal and navigate to the folder where you wish to create your website. Then, enter the following commands (replacing `my-website` with the name of your website):

```sh
npm i -g shaman-factory
factory create my-website
```

After a few seconds (time may vary, depending on processor / internet speed) you will see a new folder, called `my-website`, with some website content inside it. To start your website in development mode, open the new website folder in your terminal and type:

```sh
npm start
```

To stop the development sever, hold the Cntl button then click the "c" button (Cntl+c).

To make a production-ready copy of your website, open the file *website.json* and change the "production" value to "true". Then, enter the same command seen above. Once the command is finished, the "dest" folder will now contain the fully-compiled contents of your website. The compiled website is completely minimized, bundles injected, etc. and is ready to deploy to your web hosting server. 

## CLI Reference

The factory script follows the following format:

```sh
factory [command] [...arguments]
```

- **command:** The specific command you wish Shaman Factory to run. As of version 1.0.x the only available commands are `create` and `listen`.
- **arguments:** Arguments specific to the command that you are running.

#### Create Command

The create command takes 2 arguments (below) then generates a [shaman-website-compiler](https://github.com/iotshaman/shaman-website-compiler) compatible website. 

```sh
factory create [name] [template]
```

- **name:** Name of the website you are creating.
- **template:** (Optional) Name of the template to use (see [Templates](#templates)). If no template is provided, it will use the default template.

#### Listen Command

The listen command will create an http server to listen for compilation requests. This allows websites to be setup to request re-compilation programatically. Once you have called "factory listen..." simply make an HTTP POST call to "http://localhost:10003/compile" and your website will be compiled. 

```sh
factory listen [path] [port]
```

- **path:** Path (relative or absolute) to your website. The website must be a [shaman-website-compiler](https://github.com/iotshaman/shaman-website-compiler) compatible website. To use the current directory, use "." as the path parameter.
- **port:** (Optional) Http port to listen on. Defaults to "10003".

## Templates

Shaman Factory comes pre-installed with templates to choose from. Every template is [shaman-website-compiler](https://github.com/iotshaman/shaman-website-compiler) compatible, meaning every website created by Shaman Factory will follow the best-practices of file minification, file bundling, pre-rendering, and so much more. This is a solid start gaining a competitive advantage in the online marketplace! This list is subject to change, so check back in periodically to see what's new.

To view a complete list of available templates, [click here](https://github.com/iotshaman/shaman-factory/tree/master/templates).
