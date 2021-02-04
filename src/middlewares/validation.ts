
import revalidator from "revalidator";
import { schema } from '../validation-schema'

const pattern = (regex: any) => {
  return (value: string) => {
    return new RegExp(regex).test(value);

  }
}
export const validate = (model: string, data: any) => {
  try {
    const seg: string[] = model.split(':');
    let definition = schema[seg[0]] || {};
    definition = definition[seg[1]] || {};
    definition = definition[seg[2]] || {};
    Object.keys(definition.properties || {}).forEach((key) => {
      if (definition.properties[key].hasOwnProperty('pattern')) {
        definition.properties[key].conform = pattern(definition.properties[key].pattern);
        definition.properties[key].message = 'Password should contain atleast one capital,lower alphabets and one number, special symbol, and 6 char long.  '

      }

    })

    return revalidator.validate(data, definition, {
      additionalProperties: !definition.hasOwnProperty('type')
    });
  } catch (e) {
    throw e;
  }
}

