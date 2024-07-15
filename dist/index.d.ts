import { RequestHandler } from 'express';

type Options = {
    logFiles: boolean;
};
declare class Logger {
    private options;
    private logFiles;
    constructor(options: Options);
    private fileAppend;
    private getTime;
    info: (message: string) => void;
    error: (message: string) => void;
    httpExpress: RequestHandler;
}

export { Logger };
