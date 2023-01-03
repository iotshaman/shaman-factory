export class CommandLineInput {

  private _command: string;
  private _flags: string[] = [];
  private _parameters: {key: string, value: string}[] = [];
  private flagRegex: RegExp = /-{1}[a-zA-Z]+[^ ]+/;
  private parameterRegex: RegExp = /-{2}[a-zA-Z]+=.+/;

  constructor(argv: string[]) {
    if (argv.length < 3) throw new Error('No command provided.');
    this._command = argv[2];
    if (argv.length == 3) return;
    let args = argv.slice(3);
    this._flags = args.filter(a => this.flagRegex.test(a)).map(arg => arg.slice(1));
    this._parameters = args.filter(a => this.parameterRegex.test(a)).map(arg => {
      let parts = arg.split('=');
      return {
        key: parts[0].slice(2),
        value: parts[1]
      };
    });
  }

  get command(): string {
    return this._command;
  }

  get flags(): string[] {
    return this._flags;
  }

  get parameters(): {key: string, value: string}[] {
    return this._parameters;
  }

  public hasFlag(flag: string) {
    return this._flags.includes(flag);
  }

  public hasParameter(parameter: string) {
    return !!this._parameters.find(p => p.key == parameter);
  }

  public getParameterValueOrDefault(parameter: string, defaultValue?: string): string {
    if (!this.hasParameter(parameter)) return defaultValue;
    return this._parameters.find(p => p.key == parameter).value;
  } 

}
