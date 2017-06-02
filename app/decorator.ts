import 'reflect-metadata'
import {JsonSchema} from './JsonSchema'
import {MySchema} from './MySchema'
import {extendObservable} from 'mobx'
import convertSchema from './convertSchema'

const baseSchema: JsonSchema = {
  $schema: 'http://json-schema.org/schema#',
  type: 'object',
  properties: {},
  required: [],
  id: '',
  title: undefined,
  description: 'undefined'
}

export function schema(mySchema: MySchema = {}): PropertyDecorator {
  return (target: any, propertyKey: string): void => {
    const schema = convertSchema(mySchema)
    let jsonSchema = {...baseSchema, ...target.constructor.schema}
    jsonSchema.title = target.constructor.name.toString()
    jsonSchema.id = target.constructor.name.toString()

    if (schema.required) {
      if (!jsonSchema.required) {
        jsonSchema.required = []
      }
      jsonSchema.required.push(propertyKey)
      delete schema.required
    }

    if (!jsonSchema.properties) {
      jsonSchema.properties = {}
    }
    jsonSchema.properties[propertyKey] = {
      ...jsonSchema.properties[propertyKey],
      ...schema
    }

    let get: boolean = false
    const propertyDefinition = Object.getOwnPropertyDescriptor(
      target,
      propertyKey
    )
    if (propertyDefinition) {
      get = !!propertyDefinition.get
    }
    const newInstance = new target.constructor()
    if (newInstance[propertyKey] && !get) {
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
