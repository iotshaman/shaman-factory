import { injectable } from 'inversify';
import { Website } from 'shaman-website-compiler';
import { IoC, TYPES } from "../composition/app.composition";
import { WebsiteContext } from '../models/website.context';
import { Blog } from '../models/blog';
import { Converter } from 'showdown';

export interface IBlogService {
  getAllBlogs: () => Promise<Blog[]>;
  getBlog: (filename: string) => Promise<Blog>;
  addBlog: (title: string, author: string) => Promise<Blog>;
  updateBlog: (blog: Blog) => Promise<Blog>;
  deleteBlog: (filename: string) => Promise<void>;
}

@injectable()
export class BlogService implements IBlogService {

  private website: Website
  private context: WebsiteContext;

  constructor() {
    this.website = IoC.get<Website>(TYPES.Website);
    this.context = IoC.get<WebsiteContext>(TYPES.WebsiteContext);
  }

  getAllBlogs = (): Promise<Blog[]> => {
    return Promise.resolve(
      this.context.models.blogs.filter(b => !!b)
        .map(blog => new Blog(blog))
        .sort((a, b) => a.createdDate > b.createdDate ? -1 : 1)
    );
  }

  getBlog = (filename: string): Promise<Blog> => {
    return new Promise(res => {
      let blog = this.context.models.blogs.find(filename);
      res(new Blog(blog));
    })
  }

  addBlog = (title: string, author: string): Promise<Blog> => {
    let name = this.createBlogNameFromTitle(title);
    let filename = `${name}.html`;
    let blog = new Blog({filename, name, title, author});
    this.context.models.blogs.add(blog.filename, blog);
    return this.context.saveChanges()
      .then(_ => this.context.models.blogs.find(blog.filename))
      .then(rslt => new Blog(rslt));
  }

  updateBlog = (blog: Blog): Promise<Blog> => {
    return Promise.resolve(this.changeModifiedDate(blog))
      .then(rslt => this.compileMarkdown(rslt))
      .then(rslt => this.upsertBlog(rslt))
      .then(rslt => new Blog(rslt));
  }

  deleteBlog = (filename: string) => {
    return Promise.resolve(this.context.models.blogs.delete(filename))
      .then(_ => this.context.saveChanges())
      .then(_ => this.updateBlogTemplates())
      .then(_ => (null));
  }

  private createBlogNameFromTitle(title: string): string {
    return title.replace(/ /g, '-').replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
  }

  private upsertBlog = (blog: Blog): Promise<Blog> => {
    return new Promise((res, ex) => {
      let original = this.context.models.blogs.find(blog.filename);
      let changed = original.published != blog.published;
      this.context.models.blogs.upsert(blog.filename, blog)
      this.context.saveChanges()
        .then(_ => { if (!changed) return; return this.updateBlogTemplates(); })
        .then(_ => res(blog))
        .catch(err => ex(err));
    })
  }

  private changeModifiedDate = (obj: Blog) => {
    let blog = new Blog(obj);
    blog.setModifiedDate((new Date()).toISOString());
    return blog;
  }

  private compileMarkdown = (blog: Blog): Blog => {
    let converter = new Converter({'openLinksInNewWindow': true});
    blog.html = converter.makeHtml(blog.text);
    return blog;
  }

  private updateBlogTemplates = () => {
    let templates = ['src.website/index.html', 'src.website/blog.html'];
    let operations = templates.map(t => this.website.fileChanged(t));
    return Promise.all(operations);
  }

}