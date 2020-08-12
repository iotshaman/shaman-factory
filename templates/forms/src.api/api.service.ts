import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from 'cors';

import { injectable } from "inversify";
import { IoC, TYPES } from "./composition/app.composition";
import { ApiRouter } from "./api.router";
import { IAppConfig } from "./models/app.config";
import { ILogger } from "./logger";

export interface IApiService {
  app: express.Application;
  startApplication: () => Promise<void>;
}

@injectable()
export class ApiService implements IApiService {
  
  private config: IAppConfig;
  private logger: ILogger;
  public app: express.Application;
  private router: ApiRouter;
  public serverStarted: boolean = false;
  
  constructor() {
    this.config = IoC.get<IAppConfig>(TYPES.AppConfig);
    this.logger = IoC.get<ILogger>(TYPES.Logger);
    this.configure();
  }

  private configure = (): void => {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors({
      credentials: true, 
      methods: 'GET,POST,PUT,DELETE',
      allowedHeaders: 'Content-Type,Data-Type,Authorization',
    }));
    this.router = new ApiRouter(this.app);
  }

  public startApplication = (): Promise<void> => {
    return new Promise((res) => {
      if (this.serverStarted) return res();
      this.app.listen(this.config.port, () => {
        this.logger.log(`Content server listening on port ${this.config.port}`);
        this.serverStarted = true;
        res();
      })
    });
  }

}