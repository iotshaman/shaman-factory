# Typescript HTML Client
*This project was scaffolded using Shaman Factory*

This typescript client project is a light-weight HTML website, built on top of the [Shaman Website Compiler](https://www.npmjs.com/package/shaman-website-compiler). Using the Shaman Website Compiler you can easily build public-facing websites that are small, light-weight, and most importantly, SEO-friendly. Here is a list of some of the features that come included:

- Javascript file minifcation
- CSS file minification
- HTML file minification
- HTML Templating (with easy-to-configure models)
- XML Sitemap generator
- Built-in database connectivity
- File bundling (to reduce http requests)
- Dynamic route generation
- Development server for local testing and debugging
- Much more!

For more information about the Shaman Website Compiler, visit the [official github page](https://www.npmjs.com/package/shaman-website-compiler).

## Building the Project

Since websites built with the Shaman Website Compiler are pre-rendered, you can "build" your website then deploy it as a static website; even better, you can have some other server software (Nginx, Apache, etc.) serve your pre-rendered static files, and have a server project run the "build" command when changes are made to the underlying data.

If you scaffolded this project as part of a ["solution"](https://www.npmjs.com/package/shaman-factory#scaffold-solution-command) then you can use Shaman Factory to build this project. Open a command line interface (CMD, bash, etc.) and navigate to your solution folder (where your shaman.json file is located), and run the following command:

```sh
sf build node
```

If you scaffolded this project [manually](https://www.npmjs.com/package/shaman-factory#scaffold-command) then you can use the npm command to build the project. Open a command line interface (CMD, bash, etc.) and navigate to the library project folder, then run the following command:

```sh
npm run build
```

## Debugging the Website

*Note: you will need to build the server project before starting the server*

The Shaman Website Compiler includes a development server, which will render your website in-memory and serve it over HTTP, and automatically re-render whenever your source files are changed. This is very useful when developing, debugging and testing your website. Please note that while the development server will re-render when files are changed, it does not currently support hot-reloading in a browser, so you will need to refresh your browser page.

If you scaffolded this project as part of a ["solution"](https://www.npmjs.com/package/shaman-factory#scaffold-solution-command) then you can use Shaman Factory to start the development server. Open a command line interface (CMD, bash, etc.) and navigate to your solution folder (where your shaman.json file is located), and run the following command:

```sh
sf run [project]
```

If you scaffolded this project [manually](https://www.npmjs.com/package/shaman-factory#scaffold-command) then you can use the npm command to start the development server. Open a command line interface (CMD, bash, etc.) and navigate to the server project folder, then run the following command:

```sh
npm start
```