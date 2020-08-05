import { injectable } from 'inversify';
import { IoC, TYPES } from "../composition/app.composition";
import { WebsiteContext } from '../models/website.context';
import { Blog } from '../models/blog';
import { Converter } from 'showdown';

export interface IBlogService {
  getAllBlogs: () => Promise<Blog[]>;
  getBlog: (filename: string) => Promise<Blog>;
  addBlog: (blog: Blog) => Promise<Blog>;
  updateBlog: (blog: Blog) => Promise<Blog>;
}

@injectable()
export class BlogService implements IBlogService {

  private context: WebsiteContext;

  constructor() {
    this.context = IoC.get<WebsiteContext>(TYPES.WebsiteContext);
  }

  getAllBlogs = (): Promise<Blog[]> => {
    return Promise.resolve(
      this.context.models.blogs.filter(b => !!b)
        .map(blog => new Blog(blog))
        .sort((a, b) => a.date > b.date ? -1 : 1)
    );
  }

  getBlog = (filename: string): Promise<Blog> => {
    return new Promise(res => {
      let blog = this.context.models.blogs.find(filename);
      res(new Blog(blog));
    })
  }

  addBlog = (blog: Blog): Promise<Blog> => {
    this.context.models.blogs.add(blog.filename, blog);
    return this.context.saveChanges()
      .then(_ => this.context.models.blogs.find(blog.filename))
      .then(rslt => new Blog(rslt));
  }

  updateBlog = (blog: Blog): Promise<Blog> => {
    return Promise.resolve(this.compileMarkdown(blog))
      .then(rslt => this.context.models.blogs.upsert(rslt.filename, blog))
      .then(_ => this.context.saveChanges())
      .then(_ => this.context.models.blogs.find(blog.filename))
      .then(rslt => new Blog(rslt));
  }

  private compileMarkdown = (blog: Blog): Blog => {
    let converter = new Converter({'openLinksInNewWindow': true});
    blog.html = converter.makeHtml(blog.text);
    return blog;
  }

}