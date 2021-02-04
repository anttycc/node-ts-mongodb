import { Request, Response, NextFunction } from "express";

export const ErrorCallback = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error)
  const statusCode = error.errorCode || 500;
  res.status(statusCode).send(error);
}