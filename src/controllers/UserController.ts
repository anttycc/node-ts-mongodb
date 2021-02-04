import { Request, Response, NextFunction } from "express";

import { IBaseController } from "./IBaseController"
import { Controller } from '../di-ts/ControllerDecorator'
import UserService from '../services/UserService'

interface IUserController {
  createUser(req: Request, res: Response, next: NextFunction): any;
  login(req: Request, res: Response, next: NextFunction): any;
}
@Controller()
export class UserController implements IBaseController, IUserController {

  get getHandlers() {
    const props = Object.getPrototypeOf(this);
    let properties: any = {};
    for (const k in props) {
      properties[k] = props[k].bind(this);
    }
    return properties;
  }

  constructor(private userService: UserService) {
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.userService.createUser(req.body);
      res.status(200).json({code:200});
    } catch (e) {
      next(e);
    }

  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.userService.validateUser(req.body);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

}