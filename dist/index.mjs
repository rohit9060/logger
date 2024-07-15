// src/logger.ts
import fs from "fs";
import onFinished from "on-finished";
var Logger = class {
  //
  constructor(options) {
    this.options = options;
    this.logFiles = false;
    // append file
    this.fileAppend = (name, data) => {
      fs.appendFileSync(`./logs/${name}.log`, `${data}
`, { encoding: "utf-8" });
    };
    // get time
    this.getTime = () => {
      const time = /* @__PURE__ */ new Date();
      return time.toLocaleString();
    };
    // info log
    this.info = (message) => {
      const time = this.getTime();
      const data = `${time}, ${message}`;
      if (this.logFiles) {
        this.fileAppend("info", data);
      }
      console.log(`\x1B[33m ${data}`);
    };
    // error log
    this.error = (message) => {
      const time = this.getTime();
      const data = `${time}, ${message}`;
      if (this.logFiles) {
        this.fileAppend("error", data);
      }
      console.log(`\x1B[31m ${data}`);
    };
    // http log middleware for express
    this.httpExpress = (req, res, next) => {
      const method = req.method;
      const url = req.originalUrl;
      const start = Date.now();
      onFinished(res, (err, response) => {
        const time = Date.now() - start;
        const code = response.statusCode;
        const date = (/* @__PURE__ */ new Date()).toLocaleString();
        const data = `${date}  ${method} ${url} ${time}ms ${code}`;
        let codeColor;
        switch (code) {
          case 200:
            codeColor = `\x1B[32m`;
            break;
          case 500:
            codeColor = `\x1B[31m`;
            break;
          case 400:
            codeColor = `\x1B[31m`;
          case 404:
            codeColor = `\x1B[31m`;
          case 401:
            codeColor = `\x1B[33m`;
            break;
          default:
            codeColor = `\x1B[32m`;
        }
        if (this.logFiles) {
          this.fileAppend("access", data);
        }
        console.log(
          `\x1B[34m ${date} ${codeColor}  ${method} ${url} \x1B[34m ${time} ms ${codeColor} ${code}`
        );
      });
      next();
    };
    var _a;
    this.logFiles = (_a = this.options) == null ? void 0 : _a.logFiles;
    if (!fs.existsSync("./logs")) {
      if (this.logFiles)
        fs.mkdirSync("./logs");
    }
  }
  //
};
export {
  Logger
};
