import * as _http from 'http';
import * as _path from 'path';
import * as _cmd from 'child_process';
import { IncomingMessage, ServerResponse } from 'http';
import { ICommand } from "./command";

export class ListenCommand implements ICommand {

  get name(): string { return "listen"; }
  private path: string;
  /* istanbul ignore next */
  private npm: string = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  run = (path: string = "", port: string = "10003"): Promise<void> => {
    this.path = path;
    console.log("Listening for compilation requests...")
    _http.createServer(this.handleRequest).listen(port);
    return Promise.resolve();
  }
  
  private handleRequest = (req: IncomingMessage, res: ServerResponse): void => {
    if (req.url != "/compile" || req.method != "POST") {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end();
      return;
    }
    this.compileWebsite().then(_ => {
      res.writeHead(204);
      res.end();
    }).catch(ex => {
      console.log(ex);
      res.writeHead(500);
      res.end();
    })
  }

  private compileWebsite = () => {
    return new Promise((res, err) => {
      let path = _path.join(process.cwd(), this.path);
      if (_path.isAbsolute(this.path)) path = this.path;
      console.log(`Compiling website at location '${path}'...`);
      _cmd.exec(`${this.npm} start`, {cwd: path}, function(ex, _stdout, stderr) {
        if (ex) return err(ex);
        if (stderr) console.log(stderr);
        console.log('Compilation complete.');
        res();
      });
    })
  }

}