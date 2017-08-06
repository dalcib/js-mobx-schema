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

interface ArgsPropertyDecorator {
  target: any
  propertyKey?: string
  descriptor?: any
}

//declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
//declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;
//declare type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;

export function schemax(
  JsSchema: JsSchema = {}
): PropertyDecorator | ClassDecorator {
  return function(this: any, ...args: any[]) {
    switch (args.length) {
      case 1:
        return schemaClass.apply(this, args)
      case 2:
        return schemaProperty.apply(this, args)

      default:
        throw new Error('Decorators are not valid here!')
    }
  }
}

export function schema(JsSchema: JsSchema = {}) {
  return (target: any, propertyKey?: string, descriptor?: any): void | any => {
    //console.log('AAAAAAAAAAA', ...args, JsSchema, args.length, 'length')
    if (propertyKey) {
      schemaProperty(target, propertyKey, descriptor, JsSchema)
    } else {
      schemaClass(target, JsSchema)
    }

    /*  switch (args.length) {
      case 1:
        console.log('Class', args)
        //return schemaClass.apply(this, args)
        schemaClass(args[0])
        break
      case 3:
        console.log('Property', args)
        schemaProperty(target, propertyKey, descriptor, JsSchema)
        break */
    //return schemaProperty.apply(this, args)
    /* case 3:
      if(typeof args[2] === "number") {
        return logParameter.apply(this, args);
      }
      return logMethod.apply(this, args); */
    // tslint:disable-next-line:no-switch-case-fall-through
    //default:
    //console.log()
    //throw new Error('Decorators are not valid here!' + args)
    //}
  }
}

/* export function schema(...args: any[]) {
  if (args.length === 1) {
    console.log('WWWWWWWWWWWW', args[0])
    return schemaClass(args[0])
  } else {
    return schemaProperty(...args)
  }
} */

function schemaProperty<T>(
  target: any,
  propertyKey: string /* | symbol */,
  descriptor: TypedPropertyDescriptor<T>,
  JsSchema: JsSchema
): TypedPropertyDescriptor<T> | void {
  console.log('PPPPPProp', target, propertyKey, descriptor, JsSchema)

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

  console.log(
    'LLLLL',
    propertyKey,
    target[propertyKey],
    newInstance[propertyKey]
    //target.constructor.schema
  )
}

interface Target extends Function {
  schema: any
  name: string
}

// tslint:disable-next-line:ban-types
export function schemaClass<TFunction extends Target>(
  target: TFunction,
  JsSchema: JsSchema
  //propertyKey?: string,
  //defaultValue?: any
): TFunction | void {
  // save a reference to the original constructor
  const original = target

  const schema = original.schema
  console.log(
    'DDDDDDDDDD',
    //JSON.stringify(target.constructor.schema),
    target.schema,
    target
  )

  // a utility function to generate instances of a class
  function construct(constructor: any, args: any[]) {
    const c: any = function(this: any) {
      return constructor.apply(this, args)
    }
    c.prototype = constructor.prototype
    return new c()
  }

  // the new constructor behaviour
  const f: any = (...args: any[]) => {
    console.log('New: ' + original.name)
    return construct(original, args)
  }

  // copy prototype so intanceof operator still works
  f.prototype = original.prototype
  f.schema = schema

  // return new constructor (will override original)
  return f

  /*
  // save a reference to the original constructor
  const original = target
  const schema = target.schema

  // the new constructor behaviour
  const f: any = function(this: any, ...args: any[]) {
     if (propertyKey) {
      this[propertyKey] = defaultValue || undefined
      console.log('New: ', propertyKey, defaultValue, this[propertyKey])
    }
    console.log('New: ' + original.name, original, typeof original)
    //return original.apply(this, args)
  }

  // copy prototype so intanceof operator still works
  f.prototype = original.prototype
  f.schema = schema


  // return new constructor (will override original)
  return f

  */
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
