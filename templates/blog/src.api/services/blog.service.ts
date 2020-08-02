import { injectable } from 'inversify';
import { IoC, TYPES } from "../composition/app.composition";
import { WebsiteContext } from '../models/website.context';
import { Blog } from '../models/blog';

export interface IBlogService {
  getAllBlogs: () => Promise<Blog[]>;
}

@injectable()
export class BlogService implements IBlogService {

  private websiteContext: WebsiteContext;

  constructor() {
    this.websiteContext = IoC.get<WebsiteContext>(TYPES.WebsiteContext);
  }

  getAllBlogs = (): Promise<Blog[]> => {
    return Promise.resolve(
      this.websiteContext.models.blogs.filter(b => !!b)
    );
  }

}