export class User {
  email: string;
  name: string;
  passwordHash: string;
  primary?: boolean;
  temporaryPass?: boolean;
}