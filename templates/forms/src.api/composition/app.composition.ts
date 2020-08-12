import "reflect-metadata";
import * as _path from 'path';
import { Container } from "inversify";
import { Website } from 'shaman-website-compiler';
import { WebsiteContext } from "../models/website.context";
import { IAppConfig } from "../models/app.config";
import { ILogger, Logger } from "../logger";
import { IApiService, ApiService } from "../api.service";
import { IAuthService, AuthService } from "../services/auth.service";
import { IUserService, UserService } from "../services/user.service";
import { IFormService, FormService } from "../services/form.service";
import { IFormAction } from "../services/form-actions/form-action";
import { CreateTextFileAction } from "../services/form-actions/create-text-file.action";
import { IFormActionService, FormActionService } from "../services/form-action.service";

export const IoC = new Container();

export function Configure(config: IAppConfig, website: Website): Promise<Container> {
  return configureServices(config, website)
    .then(_ => configureDatabase(config))
    .then(_ => configureFormActions())
}

function configureDatabase(config: IAppConfig): Promise<Container> {
  let dataPath = _path.join(config.dataPath, "db.json");
  let websiteContext = new WebsiteContext(dataPath);
  IoC.bind<WebsiteContext>(TYPES.WebsiteContext).toConstantValue(websiteContext);
  return websiteContext.initialize().then(_ => IoC);
}

function configureServices(config: IAppConfig, website: Website): Promise<Container> {
  IoC.bind<IAppConfig>(TYPES.AppConfig).toConstantValue(config);
  IoC.bind<Website>(TYPES.Website).toConstantValue(website);
  IoC.bind<ILogger>(TYPES.Logger).to(Logger);
  IoC.bind<IApiService>(TYPES.ApiService).to(ApiService);
  IoC.bind<IAuthService>(TYPES.AuthService).to(AuthService);
  IoC.bind<IUserService>(TYPES.UserService).to(UserService);
  IoC.bind<IFormService>(TYPES.FormService).to(FormService);
  IoC.bind<IFormActionService>(TYPES.FormActionService).to(FormActionService);
  return Promise.resolve(IoC);
}

function configureFormActions(): Promise<Container> {
  IoC.bind<IFormAction>(TYPES.FormAction).to(CreateTextFileAction);
  return Promise.resolve(IoC);
}

const TYPES = {
  AppConfig: "AppConfig",
  Website: "Website",
  Logger: "Logger",
  WebsiteContext: "WebsiteContext",
  ApiService: "ApiService",
  ApiRouter: "ApiRouter",
  AuthService: "AuthService",
  UserService: "UserService",
  FormService: "FormService",
  FormActionService: "FormActionService",
  FormAction: "FormAction"
};

export { TYPES };