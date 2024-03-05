import fs from "fs";
import onFinished from "on-finished";
import { Request, Response, NextFunction, RequestHandler } from "express";

type Options = {
  logFiles: boolean;
};

class Logger {
  private logFiles: boolean = false;
  constructor(private options: Options) {
    this.logFiles = this.options?.logFiles;
    if (!fs.existsSync("./logs")) {
      if (this.logFiles) fs.mkdirSync("./logs");
    }
  }

  // append file
  private fileAppend = (name: string, data: string) => {
    fs.appendFileSync(`./logs/${name}.log`, data, { encoding: "utf-8" });
  };

  // get time
  private getTime = () => {
    const time = new Date();
    return time.toLocaleString();
  };

  // info log
  info = (message: string) => {
    const time = this.getTime();
    const data = `${time}, ${message}\n`;
    if (this.logFiles) {
      this.fileAppend("info", data);
    }
    console.log(data);
  };

  // error log
  error = (message: string) => {
    const time = this.getTime();
    const data = `${time}, ${message}\n`;
    if (this.logFiles) {
      this.fileAppend("error", data);
    }
    console.log(data);
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

      if (this.logFiles) {
        this.fileAppend("info", data);
      }
      console.log(data);
    });
    next();
  };
  //
}

export { Logger };
