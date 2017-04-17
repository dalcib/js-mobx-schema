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

import 'reflect-metadata';
import {JsonSchema} from './JsonSchema';

export function schema(jsonSchema: JsonSchema): PropertyDecorator  {
    return (target: any, propertyKey: string /*| symbol*/): void => {
        const newInstance = new target.constructor()
        const propertyDefinition = Object.getOwnPropertyDescriptor(target, propertyKey)
        let get: boolean = false
        if (propertyDefinition) {
            get = (!!propertyDefinition.get)
        }
        const schema = target.constructor.schema
        if (!schema.properties) schema.properties = {}
        schema.properties[propertyKey] = {...schema.properties[propertyKey], ...jsonSchema}
        if (newInstance[propertyKey] && !get) {
            schema.properties[propertyKey].default = newInstance[propertyKey]
        }
        //const t = Reflect.getMetadata("design:type", target, propertyKey);
        //schema.properties[propertyKey] = {...schema.properties[propertyKey], ...{type: t.name.toLowerCase}}
    }
}

        //console.log('type', t);
        //console.log(schema);