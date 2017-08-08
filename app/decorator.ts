import 'reflect-metadata'
import { JsonSchema } from './JsonSchema'

const baseSchema: JsonSchema = {
  $schema: 'http://json-schema.org/schema#',
  type: 'object',
  properties: {},
  required: [],
  id: undefined,
  title: '',
  description: '',
}

export function schema(mySchema: JsonSchema = {}): PropertyDecorator {
  return (target: any, propertyKey: string): void => {
    const schema = mySchema
    const jsonSchema = { ...baseSchema, ...target.constructor.schema }
    jsonSchema.title = target.constructor.name.toString()
    jsonSchema.id = target.constructor.name.toString()

    if (schema.required) {
      jsonSchema.required.push(propertyKey)
      delete schema.required
    }

    jsonSchema.properties[propertyKey] = {
      ...jsonSchema.properties[propertyKey],
      ...schema,
    }

    /*let get: boolean = false
    const propertyDefinition = Object.getOwnPropertyDescriptor(
      target,
      propertyKey
    )
    if (propertyDefinition) { get = !!propertyDefinition.get    }
    if (newInstance[propertyKey] && !get) {
      jsonSchema.properties[propertyKey].default = newInstance[propertyKey]
    }*/

    const newInstance = new target.constructor()
    const t = Reflect.getMetadata('design:type', newInstance, propertyKey)
    if (t && t.name && jsonSchema.properties[propertyKey].type !== 'integer') {
      jsonSchema.properties[propertyKey].type = t.name.toLowerCase()
    }

    target.constructor.schema = jsonSchema
  }
}

/*
Object.defineProperty(target, 'staticx', {
    configurable: true,
    value: 'dfsdfsdf',
    writable: true,
    enumerable: true
})

declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;
*/
