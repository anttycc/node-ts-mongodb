import {GenericClassDecorator, Type} from "./Util";

export const Service = () : GenericClassDecorator<Type<any>> => {
  return (target: Type<any>) => {
  };
};
