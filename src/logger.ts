import fs from "fs";
import onFinished from "on-finished";
import { Request, Response, NextFunction, RequestHandler } from "express";

type Options = {
  logFiles: boolean;
};

class Logger {
  private logFiles: boolean = false;

  //
  constructor(private options: Options) {
    this.logFiles = this.options?.logFiles;
    if (!fs.existsSync("./logs")) {
      if (this.logFiles) fs.mkdirSync("./logs");
    }
  }

  // append file
  private fileAppend = (name: string, data: string) => {
    fs.appendFileSync(`./logs/${name}.log`, `${data}\n`, { encoding: "utf-8" });
  };

  // get time
  private getTime = () => {
    const time = new Date();
    return time.toLocaleString();
  };

  // info log
  info = (message: string) => {
    const time = this.getTime();
    const data = `${time}, ${message}`;
    if (this.logFiles) {
      this.fileAppend("info", data);
    }
    console.log(`\u001b[33m ${data}`);
  };

  // error log
  error = (message: string) => {
    const time = this.getTime();
    const data = `${time}, ${message}`;
    if (this.logFiles) {
      this.fileAppend("error", data);
    }
    console.log(`\u001b[31m ${data}`);
  };

  // http log middleware for express
  httpExpress: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const method = req.method;
    const url = req.originalUrl;
    const start = Date.now();

    onFinished(res, (err, response) => {
      const time = Date.now() - start;
      const code = response.statusCode;
      const date = new Date().toLocaleString();
      const data = `${date}  ${method} ${url} ${time}ms ${code}`;
      let codeColor;

      switch (code) {
        case 200:
          codeColor = `\u001b[32m`;
          break;
        case 500:
          codeColor = `\u001b[31m`;
          break;
        case 400:
          codeColor = `\u001b[31m`;
        case 404:
          codeColor = `\u001b[31m`;
        case 401:
          codeColor = `\u001b[33m`;
          break;
        default:
          codeColor = `\u001b[32m`;
      }

      if (this.logFiles) {
        this.fileAppend("access", data);
      }
      console.log(
        `\u001b[34m ${date} ${codeColor}  ${method} ${url} \u001b[34m ${time} ms ${codeColor} ${code}`
      );
    });
    next();
  };
  //
}

export { Logger };
