import * as _path from 'path';
import { IAppConfig } from './models/app.config';

export function GenerateConfig(): IAppConfig {
  let dataPath = _path.join(__dirname, '..', 'data')
  var config =  require(_path.join(dataPath, 'config.json'));
  config.dataPath = dataPath;
  return config;
}