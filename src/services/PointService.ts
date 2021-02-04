
import PointModel, { IPoint } from '../models/PointModel';
import { Service } from '../di-ts/ServiceDecorator';

interface IPointService {
  createPoint(pointinfo: any): any;
  updatePoint(id: string, pointInfo: any): any;
  getPoint(id: string): any;
  getPoints(pagination: any): any;
}
@Service()
export default class PointService implements IPointService {
  constructor() {

  }
  async createPoint(pointInfo: IPoint) {
    try {
      const existingPoint = await PointModel.findOne({ title: pointInfo.title, author: pointInfo.author });
      if (existingPoint) {
        throw { errorCode: 409, message: 'Point exists.' }
      }
      return await PointModel.create(pointInfo);
    } catch (error) {
      throw error;
    }
  }

  async updatePoint(id: string, pointInfo: IPoint) {
    try {
      const existingPoint = await PointModel.findOne({ title: pointInfo.title, author: pointInfo.author, _id: { $ne: id } });
      if (existingPoint) {
        throw { errorCode: 409, message: 'Point already exists.' }
      }
      return await PointModel.findOneAndUpdate({ _id: id }, pointInfo, { new: true });
    } catch (error) {
      throw error;
    }
  }
  async getPoint(body: any) {
    try {
      const { id, author } = body;
      return await PointModel.findOne({ _id: id, author },{ title: 1, description: 1, category: 1, author: 1 });
    } catch (error) {
      throw error;
    }
  }

  async getPoints(body: any) {
    try {
      const condition: any = { author: body.author };
      if (body.search) {
        condition.$or = [{ title: body.search }, { description: body.search }];
      }
      const offset = parseInt(body.pageSize || 10, 25);
      const skip = (parseInt(body.page || 1, 10) - 1) * offset;
      const sort: any = {};
      const sortKey = body.sortKey || 'createdAt';
      sort[sortKey] = body.order || -1;
      const totalRecords = await PointModel.count(condition);
      const points = await PointModel.find(condition, { title: 1, description: 1, category: 1, author: 1 }).populate('author', 'name').sort(sort).skip(skip).limit(offset);
      const result = {
        items: points,
        pagination: {
          totalRecords,
          currentPage: body.page,
          pageSize: body.pageSize
        }
      };
      return result;
    } catch (error) {
      throw error;
    }
  }

}