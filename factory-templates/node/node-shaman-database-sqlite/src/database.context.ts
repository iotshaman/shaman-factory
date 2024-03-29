import { DatabaseContext, Collection } from 'sqlite-shaman';
import { User } from './models/user';

export class ISampleDatabaseContext {
  models: {
    user: Collection<User>
  }
  runQuery: <T>(query: string, args: any) => Promise<T[]>;
}

export class SampleDatabaseContext extends DatabaseContext {
  models = { 
    user: new Collection<User>()
  }

  runQuery = <T>(query: string, args: any): Promise<T[]> => {
    return this.query<T>(query, args);
  }
}