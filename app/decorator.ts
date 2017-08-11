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

export function schema(JsSchema: JsSchema = {}) {
  return (target: any, propertyKey?: string, descriptor?: any): void | any => {
    //console.log('AAAAAAAAAAA', ...args, JsSchema, args.length, 'length')
    if (propertyKey) {
      schemaProperty(target, propertyKey, descriptor, JsSchema)
    } else {
      schemaClass(target, JsSchema)
    }
  }
}

function schemaProperty<T>(
  target: any,
  propertyKey: string /* | symbol */,
  descriptor: TypedPropertyDescriptor<T>,
  JsSchema: JsSchema
): TypedPropertyDescriptor<T> | void {
  //console.log('PPPPPProp', target, propertyKey, descriptor, JsSchema)

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

  /*if (jsonSchema.properties[propertyKey].default) {
      logClass(target, propertyKey, jsonSchema.properties[propertyKey].default)
      console.log('XXXX')
    }*/

  const newInstance = new target.constructor()
  if (newInstance[propertyKey] && !isGet) {
    jsonSchema.properties[propertyKey].default = newInstance[propertyKey]
  }

  const t = Reflect.getMetadata('design:type', newInstance, propertyKey)
  if (t && t.name) {
    jsonSchema.properties[propertyKey].type = t.name.toLowerCase()
  }

  target.constructor.schema = jsonSchema

  /*  console.log(
    'LLLLL',
    propertyKey,
    target[propertyKey],
    newInstance[propertyKey]
    //target.constructor.schema
  ) */
}
// tslint:disable-next-line:interface-over-type-literal
type NewClass = { new (...args: any[]): {} }
interface Target extends NewClass {
  schema: any
  name: string
}

/* export function classDecorator<T extends {new(...args:any[]):{}}>(constructor:T) {
  class NewTarget extends constructor implements Target {
    speaker: string = 'Ragularuban'
    extra = 'Tadah!'
  }
} */

export function schemaClass<TFunction extends Target>(
  target: TFunction,
  JsSchema: JsSchema
): TFunction {
  // save a reference to the original constructor

  class NewTarget extends target implements Target {
    constructor() {
      super()
      // tslint:disable-next-line:no-string-literal
      //this['teste']: any = undefined
      //this.testex = undefined
      extendObservable(this, {
        newAge: 26,
      })
    }
  }

  const original = target

  const schema = original.schema
  /* console.log(
    'DDDDDDDDDD',
    //JSON.stringify(target.constructor.schema),
    target.schema,
    target
  ) */

  function construct(constructor: any, args: any[]) {
    const c: any = function(this: any) {
      // tslint:disable-next-line:no-string-literal
      this['teste'] = undefined
      this.testex = undefined
      extendObservable(this, {
        newAge: 26,
      })

      return constructor.apply(this, args)
    }
    c.prototype = constructor.prototype
    return new c()
  }

  // the new constructor behaviour
  function f(this: any, ...args: any[]) {
    console.log('New: ' + original.name)
    this['teste'] = undefined
    this.testex = undefined
    extendObservable(this, {
      newAge: 26,
    })
    return construct(original, args)
  }

  // copy prototype so intanceof operator still works
  f.prototype = original.prototype
  f.schema = schema

  return NewTarget
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

function enumerable(value: boolean) {
  return (target: any, propertyKey: string) => {
    const descriptor =
      Object.getOwnPropertyDescriptor(target, propertyKey) || {}
    if (descriptor.enumerable !== value) {
      descriptor.enumerable = value
      Object.defineProperty(target, propertyKey, descriptor)
    }
  }
}
