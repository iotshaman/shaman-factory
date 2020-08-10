import { injectable } from "inversify";
import { RepositoryContext, Repository } from 'json-repo';
import { User } from "./user";

@injectable()
export class WebsiteContext extends RepositoryContext {
  
  models = {
    users: new Repository<User>()
  }

  constructor(dataPath: string) {
    super(dataPath);
  }

}