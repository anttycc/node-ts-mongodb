import { IBaseController } from "./IBaseController"
import { Request, Response, NextFunction } from "express"

import PointService from '../services/PointService'
import { Controller } from "../di-ts/ControllerDecorator";

interface IPointController {
  getRecords?(req: Request, res: Response, next: NextFunction): any;
  createPoint?(req: Request, res: Response, next: NextFunction): any;

}
@Controller()
export class PointController implements IBaseController, IPointController {
  get getHandlers() {
    const props = Object.getPrototypeOf(this);
    let properties: any = {};
    for (const k in props) {
      properties[k] = props[k].bind(this);
    }
    return properties;
  }
  constructor(private pointService: PointService) {
  }
  async createPoint(req: Request, res: Response, next: NextFunction) {
    try {
      const { body, user }: any = req;
      const data = { ...body, author: user._id }
      await this.pointService.createPoint(data);
      res.status(200).json({code:200});
    } catch (e) {
      next(e);
    }
  }

  async updatePoint(req: Request, res: Response, next: NextFunction) {
    try {
      const { params: { id }, body, user }: any = req;
      const data = { ...body, author: user._id }
      console.log(data)
      await this.pointService.updatePoint(id, data);
      res.status(200).json({code:200});
    } catch (e) {
      next(e);
    }
  }

  async getPoint(req: Request, res: Response, next: NextFunction) {
    try {
      const { params: { id }, user }: any = req;
      const data = { id, author: user._id }
      const result = await this.pointService.getPoint(data);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
  async getPoints(req: Request, res: Response, next: NextFunction) {
    try {
      const { query, user }: any = req;
      const data = { ...query, author: user._id }
      const result = await this.pointService.getPoints(data);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }



}