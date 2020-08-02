import { injectable } from "inversify";
import { RepositoryContext, Repository } from 'json-repo';
import { User } from "./user";
import { Blog } from "./blog";

@injectable()
export class WebsiteContext extends RepositoryContext {
  
  models = {
    users: new Repository<User>(),
    blogs: new Repository<Blog>()
  }

  constructor(dataPath: string) {
    super(dataPath);
  }

}