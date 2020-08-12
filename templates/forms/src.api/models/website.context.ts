import { injectable } from "inversify";
import { RepositoryContext, Repository } from 'json-repo';
import { User } from "./user";
import { Form } from "./form";

@injectable()
export class WebsiteContext extends RepositoryContext {
  
  models = {
    users: new Repository<User>(),
    forms: new Repository<Form>()
  }

  constructor(dataPath: string) {
    super(dataPath);
  }

}