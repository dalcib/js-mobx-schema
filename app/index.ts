import { schema } from './decorator'
import { JsonSchema } from './JsonSchema'
import 'reflect-metadata'
import { autorun, observable } from 'mobx'

//@schema()
class ClassDecoratorExample {
  static schema: JsonSchema = {
    description: 'teste',
    properties: {
      name: { default: 'fghkkk' },
    },
  }

  @schema({ title: 'Name', required: true })
  //@Reflect.metadata("design:type", 'string')
  name?: string = undefined

  //@observable
  point: boolean = false

  @schema() age: number = 16

  @schema({ default: 27 })
  newAge: number

  @schema({ maximum: 23 })
  get ages(): number {
    return this.age * 2
  }

  @schema({ format: 'date' })
  date: string //=  Date().toString()

  @schema({ type: 'array' })
  list: string[]

  /* getEmpty() {
    const properties = ClassDecoratorExample.schema.properties
    const keys = Object.keys(properties)
    const empty = new ClassDecoratorExample()
    keys.forEach((key: string) => {
      const defaultValue: any = (properties as any)[key].default
      if (!(empty as any)[key]) {
        ;(empty as any)[key] = defaultValue
      }
    })
    return empty
  } */
}

///ClassDecoratorExample.schema = {...ClassDecoratorExample.schema, ...{properties: {date: {format: 'date'}}}}

const example = new ClassDecoratorExample()
console.log(example)

//autorun(() => {console.log('teste observable', example.name, example.point)} )
example.name = 'Dalci'
example.point = true
//const type = Reflect.getMetadata("design:type", ClassDecoratorExample, 'name');
//const typeAge = Reflect.getMetadata("design:type", ClassDecoratorExample, 'age');
/*const x = Reflect.hasMetadata("design:type", example, 'name')
const t = Reflect.getMetadata("design:type", example, 'name');
const tt = Reflect.getMetadata("design:type", example, 'age');
console.log('type', t, tt.name, x)*/
//ClassDecoratorExample.schema = {description: 'teste'}

export default ClassDecoratorExample
