import 'reflect-metadata'
import { JsonSchema } from './JsonSchema'
import { JsSchema } from './JsSchema'
import { extendObservable } from 'mobx'
import convertSchema from './convertSchema'

const baseSchema: JsonSchema = {
  $schema: 'http://json-schema.org/schema#',
  type: 'object',
  properties: {},
  required: [],
  id: '',
  title: undefined,
  description: 'undefined',
}

export function schema(JsSchema: JsSchema = {}): PropertyDecorator {
  return (target: any, propertyKey: string): void => {
    const schema = convertSchema(JsSchema)
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

    let isGet: boolean = false
    const propertyDefinition = Object.getOwnPropertyDescriptor(
      target,
      propertyKey
    )
    if (propertyDefinition) {
      isGet = !!propertyDefinition.get
    }
    const newInstance = new target.constructor()
    if (newInstance[propertyKey] && !isGet) {
      jsonSchema.properties[propertyKey].default = newInstance[propertyKey]
    }

    const t = Reflect.getMetadata('design:type', newInstance, propertyKey)
    if (t && t.name) {
      jsonSchema.properties[propertyKey].type = t.name.toLowerCase()
    }

    target.constructor.schema = jsonSchema
  }
}

/*
export  function schema(jsonSchema: any) {
    return (target: any ) => {
        //target.staticxx = 'dfsdfsdf'
        //target['staticxxx'] = 'dfsdfsdf'
        Object.defineProperty(target.prototype, 'schema', {})
        Object.defineProperty(target, 'staticx', {
            configurable: true,
            value: 'dfsdfsdf',
            writable: true,
            enumerable: true
        })
        console.log('targetvv:', target)
        console.log("ClassDecorator called on: ", target);

        return target
    }
}

declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;

function logType(target : any, key : string) {
      var t = Reflect.getMetadata("design:type", target, key);
      console.log(`${key} type: ${t.name}`);
    }

    export function schema(jsonSchema: any) {
        return function classDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
            return class extends constructor {
                static schema: any = jsonSchema
            }
        }
    }
*/

/*    schema.properties[propertyKey] = {
                ...schema.properties[propertyKey],
                ...{type: t.name.toLowerCase()}
            }
        }*/
