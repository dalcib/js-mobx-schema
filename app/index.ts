import {schema} from "./decorator";
import {JsonSchema} from './JsonSchema';

class ClassDecoratorExample {
    static schema: JsonSchema = {
        description: 'teste',
        properties: {
            name: {default: 'fghk'}
        }
    }

    @schema({type: 'string', title: 'Name' })
    name: string | undefined //= undefined

    @schema({type: 'Numberd'})
    age: number = 16

    @schema({maximum: 23})
    get ages(): number { return this.age * 2}

    @schema( {format: 'date'})
    date: string //=  Date().toString()

    @schema({type: 'array'})
    list: string[]

    getEmpty() {
        const properties = ClassDecoratorExample.schema.properties
        const keys = Object.keys(properties)
        const empty  = new ClassDecoratorExample()
        keys.forEach((key: string) => {
            const defaultValue: any = (properties as any)[key].default
            if (!((empty as any)[key])) {
                (empty as any)[key] = defaultValue
            }
        })
        return empty
    }
}

///ClassDecoratorExample.schema = {...ClassDecoratorExample.schema, ...{properties: {date: {format: 'date'}}}}

const example = new ClassDecoratorExample()
const type = Reflect.getMetadata("design:type", ClassDecoratorExample, 'name');
const typeAge = Reflect.getMetadata("design:type", ClassDecoratorExample, 'age');
const t = Reflect.getMetadata("design:type", example, 'name');
console.log('type', t, type, typeAge)
//ClassDecoratorExample.schema = {description: 'teste'}

export default ClassDecoratorExample
