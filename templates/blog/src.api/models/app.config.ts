export interface IAppConfig {
  port: string;
  dataPath: string;
  jwtSecret: string;
}

export class AppConfig implements IAppConfig {
  port: string;
  dataPath: string;
  jwtSecret: string;
}