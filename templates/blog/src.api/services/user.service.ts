import * as _bcrypt from 'bcryptjs';
import { injectable } from 'inversify';
import { IoC, TYPES } from "../composition/app.composition";
import { WebsiteContext } from '../models/website.context';
import { User } from '../models/user';

export interface IUserService {
  getAllUsers: () => Promise<User[]>;
  getUser: (email: string) => Promise<User>;
  addUser: (email: string, name: string, password: string) => Promise<User>;
  deleteUser: (email: string) => Promise<void>;
}

@injectable()
export class UserService implements IUserService {

  private context: WebsiteContext;

  constructor() {
    this.context = IoC.get<WebsiteContext>(TYPES.WebsiteContext);
  }

  getAllUsers = (): Promise<User[]> => {
    return Promise.resolve(
      this.context.models.users.filter(b => !!b)
    );
  }

  getUser = (email: string): Promise<User> => {
    return Promise.resolve(
      this.context.models.users.find(email)
    )
  }

  addUser = (email: string, name: string, password: string): Promise<User> => {
    let newUser = new User();
    newUser.email = email;
    newUser.name = name;
    newUser.passwordHash = _bcrypt.hashSync(password, _bcrypt.genSaltSync(8), null);
    newUser.temporaryPass = true;
    this.context.models.users.add(email, newUser);
    return this.context.saveChanges()
      .then(_ => this.context.models.users.find(email));
  }

  deleteUser = (email: string): Promise<void> => {
    return new Promise((res, err) => {
      let user = this.context.models.users.find(email);
      if (user.primary) return err(new Error("Cannot delete primary user."))
      this.context.models.users.delete(email);
      this.context.saveChanges()
        .then(_ => res())
        .catch(ex => err(ex));
    });
  }

}