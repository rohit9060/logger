"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Logger: () => Logger
});
module.exports = __toCommonJS(src_exports);

// src/logger.ts
var import_fs = __toESM(require("fs"));
var import_on_finished = __toESM(require("on-finished"));
var Logger = class {
  //
  constructor(options) {
    this.options = options;
    this.logFiles = false;
    // append file
    this.fileAppend = (name, data) => {
      import_fs.default.appendFileSync(`./logs/${name}.log`, `${data}
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
      (0, import_on_finished.default)(res, (err, response) => {
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
    if (!import_fs.default.existsSync("./logs")) {
      if (this.logFiles)
        import_fs.default.mkdirSync("./logs");
    }
  }
  //
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Logger
});
