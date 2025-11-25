import * as fs from 'fs';
import * as path from 'path';
import {compile} from 'handlebars';

export const readResource = (resourceName: string) => {
   return fs.readFileSync(path.resolve(process.cwd(), `resources/${resourceName}`), "utf-8");
};

export const readResourceTemplated = (resourceName: string, context: Record<string, string>) => {
   return compile(fs.readFileSync(path.resolve(process.cwd(), `resources/${resourceName}`), "utf-8"))(context);
};

export const readFile = (filename: string) => {
   return fs.readFileSync(filename, "utf-8");
};

export const readResourceBase64Encoded = (resourceName: string) => {
   return fs.readFileSync(path.resolve(process.cwd(), `resources/${resourceName}`), "base64");
};
