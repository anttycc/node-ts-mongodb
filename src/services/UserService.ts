import UserModel, { IUser } from '../models/UserModel';
import TokenModel from '../models/TokenModel';
import { verifyToken, getToken } from './jwt';
import { getPasswordHash, validatePassword } from './password';

import { Service } from '../di-ts/ServiceDecorator';

interface IUserService {
  createUser(client: IUser): any;
  validateUser(login: any): any;
}
@Service()
export default class UserService implements IUserService {
  constructor() { }
  async createUser(userInfo: IUser) {
    try {
      const existingUser = await UserModel.findOne({ email: userInfo.email });
      if (existingUser) {
        throw { errorCode: 409, message: 'User already exists.' }
      }
      userInfo.password = getPasswordHash(userInfo.password);
      return UserModel.create(userInfo);
    } catch (error) {
      throw error;
    }
  }
  async validateUser({ email, password }: any) {
    try {
      let result: any = {};
      let token = await TokenModel.findOne({ email });
      if (token && verifyToken(token.token).valid) {
        result = { token: `Bearer ${token.token}` };
      } else {
        const user = await UserModel.findOne({ email });
        if (!user) {
          throw { errorCode: 400, message: "email not found" };
        }
        if (user && !validatePassword(user.password.toString(), password)) {
          throw { errorCode: 400, message: "Password not matched" };
        }
        const newToken = getToken(user);
        await TokenModel.findOneAndUpdate({ email: email }, { token: newToken }, { upsert: true });
        result = { token: `Bearer ${newToken}` };
      }
      return result;
    } catch (e) {
      throw e
    }
  }

}