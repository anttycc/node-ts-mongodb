import 'reflect-metadata';
import { Type } from "./Util";

export const Injector = new class {

  resolve<T>(target: Type<any>): T {

    let tokens = Reflect.getMetadata('design:paramtypes',target)||[];
    let injections = tokens.map((token: any) => {
      return Injector.resolve<any>(token);
    });

    return new target(...injections);
  }
};
