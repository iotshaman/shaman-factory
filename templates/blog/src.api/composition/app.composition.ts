import "reflect-metadata";
import * as _path from 'path';
import { Container } from "inversify";
import { WebsiteContext } from "../models/website.context";
import { IAppConfig } from "../models/app.config";
import { ILogger, Logger } from "../logger";
import { IApiService, ApiService } from "../api.service";
import { IBlogService, BlogService } from "../services/blog.service";
import { IAuthService, AuthService } from "../services/auth.service";

export const IoC = new Container();

export function Configure(config: IAppConfig): Promise<Container> {
  return configureServices(config)
    .then(_ => configureDatabase(config));
}

function configureDatabase(config: IAppConfig): Promise<Container> {
  let dataPath = _path.join(config.dataPath, "db.json");
  let websiteContext = new WebsiteContext(dataPath);
  IoC.bind<WebsiteContext>(TYPES.WebsiteContext).toConstantValue(websiteContext);
  return websiteContext.initialize().then(_ => IoC);
}

function configureServices(config: IAppConfig): Promise<Container> {
  IoC.bind<IAppConfig>(TYPES.AppConfig).toConstantValue(config);
  IoC.bind<ILogger>(TYPES.Logger).to(Logger);
  IoC.bind<IApiService>(TYPES.ApiService).to(ApiService);
  IoC.bind<IAuthService>(TYPES.AuthService).to(AuthService);
  IoC.bind<IBlogService>(TYPES.BlogService).to(BlogService);
  return Promise.resolve(IoC);
}

const TYPES = {
  AppConfig: "AppConfig",
  Logger: "Logger",
  WebsiteContext: "WebsiteContext",
  ApiService: "ApiService",
  ApiRouter: "ApiRouter",
  AuthService: "AuthService",
  BlogService: "BlogService"
};

export { TYPES };