import { Configure, TYPES } from "./composition/app.composition";
import { IApiService } from './api.service';
import { GenerateConfig } from "./config.factory";

process.title = "blog-api";

let config = GenerateConfig();
Configure(config)
  .then(IoC => {
    let apiService = IoC.get<IApiService>(TYPES.ApiService);
    return apiService.startApplication();
  })
  .catch(ex => {
    console.dir(ex);
    process.exit(1);
  });