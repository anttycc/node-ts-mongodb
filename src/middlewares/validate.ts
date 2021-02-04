import { validate } from "./validation";
import { Request, Response, NextFunction } from "express"

const replaceQueryString = (url = '') => {
  const start = url.indexOf('?');
  if (start > -1) {
    url = url.replace(url.substring(start, url.length), '');
  }
  return url;
}
const replaceParams = (url = '', params: any = {}) => {
  for (const p in params) {
    url = url.replace(new RegExp(`/${params[p]}`), '');
  }
  return url;
}
const handler = (url: string,method:string, type: string, urlParams: any = {}, data: any = {}, next: NextFunction) => {
  try {
    let urlSegments = replaceParams(replaceQueryString(url), urlParams).split('/');
    let model = `${urlSegments[urlSegments.length - 1]}:${method.toLowerCase()}:${type}`;
    let { valid, errors } = validate(model, data);
    if (!valid) {
      next({ errorCode: 400, errors: errors.map((e: { property: any; message: any; }) => {
        return `${e.property} ${e.message}`;
      }).join('\n') })
    } else {
      next();
    }
  } catch (e) {
    next(e);
  }
}
export const validateBody = (req: Request, res: Response, next: NextFunction) => {
  let url = req.url;
  let method = req.method;

  handler(url, method,'body', req.params, req.body, next)
}
export const validateParams = (req: Request, res: Response, next: NextFunction) => {
  let url = req.url;
  let method = req.method;

  handler(url,method, 'params', req.params, req.params, next)

}
export const validateQuery = (req: Request, res: Response, next: NextFunction) => {
  let url = req.url;
  let method = req.method;

  handler(url,method, 'query', req.params, req.query, next)
}